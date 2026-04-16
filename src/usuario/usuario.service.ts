import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Usuario } from './entities/usuario.entity';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { ResponseUsuarioDto } from './dto/response-usuario.dto';
import { FileUploadService } from 'src/auth/supabase-storage/file-upload.service';
import { SupabaseAuthService } from 'src/auth/supabase-auth/auth-password.service';
import { TokenRecuperacionService } from 'src/token_recuperacion/token_recuperacion.service';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class UsuarioService {
  private readonly SALT_ROUNDS = 10;

  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    private readonly fileUploadService: FileUploadService,
    private readonly supabaseAuthService: SupabaseAuthService,
    private readonly tokenRecuperacionService: TokenRecuperacionService,
    private readonly mailService: MailService
  ) { }

  // ─── DTO mapping ───────────────────────────────────────────────
  
  /**
   * Mapea una entidad Usuario a su DTO de respuesta.
   * @param usuario Entidad usuario.
   * @returns DTO de respuesta.
   */
  private toResponseDto(usuario: Usuario): ResponseUsuarioDto {
    return {
      Usuario_id: usuario.Usuario_id,
      Nombre: usuario.Nombre,
      Apellido: usuario.Apellido,
      Correo: usuario.Correo,
      Foto: usuario.Foto,
      Auth_Provider: usuario.Auth_Provider,
      Premium: usuario.Premium,
      Expira: usuario.Expira,
      Estado: usuario.Estado,
      Registro: usuario.Registro,
      Actualizado: usuario.Actualizado,
      supabaseId: usuario.supabaseId ?? null,
    };
  }

  // ─── Consultas ─────────────────────────────────────────────────

  /**
   * Obtiene todos los usuarios activos.
   * @returns Lista de usuarios en formato DTO.
   */
  async findAll(): Promise<ResponseUsuarioDto[]> {
    const usuarios = await this.usuarioRepository.find({ where: { Estado: true } });
    return usuarios.map(u => this.toResponseDto(u));
  }

  /**
   * Obtiene un usuario por su ID.
   * @param usuarioId ID del usuario.
   * @returns DTO del usuario.
   */
  async findOne(usuarioId: number): Promise<ResponseUsuarioDto> {
    const usuario = await this.findEntityById(usuarioId);
    return this.toResponseDto(usuario);
  }

  /**
   * Busca la entidad de un usuario por su ID, asegurando que esté activo.
   * @param usuarioId ID del usuario.
   * @returns Entidad Usuario.
   * @throws NotFoundException si el usuario no existe.
   */
  async findEntityById(usuarioId: number): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findOne({
      where: { Usuario_id: usuarioId, Estado: true },
    });
    if (!usuario) throw new NotFoundException('Usuario no encontrado');
    return usuario;
  }

  /**
   * Busca un usuario por su correo electrónico.
   * @param correo Correo a buscar.
   * @returns Entidad Usuario o null si no existe.
   */
  async findByCorreo(correo: string): Promise<Usuario | null> {
    return this.usuarioRepository.findOne({ where: { Correo: correo, Estado: true } });
  }

  /**
   * Busca un usuario por su ID de Supabase.
   * @param supabaseId ID de Supabase.
   * @returns DTO del usuario o null si no existe.
   */
  async findBySupabaseId(supabaseId: string): Promise<ResponseUsuarioDto | null> {
    const usuario = await this.usuarioRepository.findOne({
      where: { supabaseId, Estado: true },
    });
    return usuario ? this.toResponseDto(usuario) : null;
  }

  // ─── Contraseña ────────────────────────────────────────────────

  /**
   * Valida si una contraseña en texto plano coincide con su hash.
   * @param contrasenaPlana Contraseña sin cifrar.
   * @param contrasenaHash Hash de la contraseña.
   * @returns true si coinciden, false en caso contrario.
   */
  async validarContrasena(contrasenaPlana: string, contrasenaHash: string | null): Promise<boolean> {
    if (!contrasenaHash) return false;
    return bcrypt.compare(contrasenaPlana, contrasenaHash);
  }

  /**
   * Cifra una contraseña usando bcrypt.
   * @param contrasena Contraseña a cifrar.
   * @returns Hash de la contraseña.
   */
  private async cifrarContrasena(contrasena: string): Promise<string> {
    return bcrypt.hash(contrasena, this.SALT_ROUNDS);
  }

  // ─── Crear ─────────────────────────────────────────────────────

  /**
   * Crea un nuevo usuario en el sistema.
   * @param datos Datos del usuario a crear.
   * @returns Usuario creado en formato DTO.
   * @throws ConflictException si el correo ya está registrado.
   * @throws BadRequestException si falta la contraseña para registro local.
   */
  async create(datos: CreateUsuarioDto): Promise<ResponseUsuarioDto> {
    const existe = await this.findByCorreo(datos.Correo);
    if (existe) throw new ConflictException('El correo ya está registrado');

    if (!datos.supabaseId && !datos.Contrasena) {
      throw new BadRequestException('La contraseña es obligatoria para registro local');
    }

    const contrasenaCifrada = datos.Contrasena ? await this.cifrarContrasena(datos.Contrasena) : null;

    const usuario = this.usuarioRepository.create({
      ...datos,
      Contrasena: contrasenaCifrada,
      Auth_Provider: datos.supabaseId ? 'supabase' : 'local',
    });

    const guardado = await this.usuarioRepository.save(usuario);
    return this.toResponseDto(guardado);
  }

  /**
   * Crea o retorna un usuario proveniente de Supabase.
   * @param user Datos del usuario de Supabase.
   * @returns Usuario en formato DTO.
   */
  async createFromSupabase(user: {
    email: string;
    userId: string;
    nombre?: string;
    apellido?: string;
    foto?: string | null;
  }): Promise<ResponseUsuarioDto> {
    const existente = await this.usuarioRepository.findOne({ where: { supabaseId: user.userId, Estado: true } });
    if (existente) return this.toResponseDto(existente);

    const nuevoUsuario = this.usuarioRepository.create({
      Correo: user.email,
      supabaseId: user.userId,
      Nombre: user.nombre ?? '',
      Apellido: user.apellido ?? '',
      Foto: user.foto ?? null,
      Auth_Provider: 'supabase',
      Contrasena: null,
      Estado: true,
      Premium: false,
      Expira: null,
    });

    const guardado = await this.usuarioRepository.save(nuevoUsuario);
    return this.toResponseDto(guardado);
  }

  // ─── Actualizar ────────────────────────────────────────────────

  /**
   * Actualiza la información de un usuario.
   * @param usuarioId ID del usuario.
   * @param datos Nuevos datos.
   * @param file (Opcional) Nueva foto de perfil.
   * @returns Usuario actualizado en formato DTO.
   */
  async update(usuarioId: number, datos: UpdateUsuarioDto, file?: File,): Promise<ResponseUsuarioDto> {
    const usuario = await this.findEntityById(usuarioId);
    if (file) {
      datos.Foto = await this.fileUploadService.uploadFile(file, 'usuario');
    }
    Object.assign(usuario, datos);
    const guardado = await this.usuarioRepository.save(usuario);
    return this.toResponseDto(guardado);
  }

  /**
   * Cambia la contraseña de un usuario en Supabase.
   * @param supabaseId ID de Supabase.
   * @param contrasenaNueva Nueva contraseña.
   */
  async cambiarContrasena(supabaseId: string, contrasenaNueva: string): Promise<void> {
    // Llamada directa a Supabase
    await this.supabaseAuthService.cambiarContrasena(supabaseId, contrasenaNueva);
  }

  /**
   * Inicia el proceso de recuperación de contraseña enviando un PIN al correo.
   * @param email Correo del usuario.
   */
  async solicitarRecuperacion(email: string): Promise<void> {
    const usuario = await this.usuarioRepository.findOne({
      where: { Correo: email, Estado: true },
    });

    // No revelar si existe o no por seguridad
    if (!usuario) return;

    // 1. Generar y guardar PIN en nuestra DB local
    const token = await this.tokenRecuperacionService.create(
      usuario.Usuario_id,
    );

    // 2. Enviar el código por email usando nuestro MailService local (Nodemailer)
    try {
      await this.mailService.enviarCodigo(email, token.Token);
    } catch (error) {
      console.error('Error enviando email de recuperación:', error);
      throw new BadRequestException('No se pudo enviar el correo de recuperación');
    }
  }

  /**
   * Confirma la recuperación de contraseña validando el PIN y actualizando en Supabase.
   * @param email Correo del usuario.
   * @param codigo PIN de recuperación.
   * @param nuevaContrasena Nueva contraseña.
   * @throws BadRequestException si hay errores en la validación o actualización.
   */
  async confirmarRecuperacion(
    email: string,
    codigo: string,
    nuevaContrasena: string,
  ): Promise<void> {
    // 1. Buscar usuario activo
    const usuario = await this.usuarioRepository.findOne({
      where: { Correo: email, Estado: true },
    });

    if (!usuario || !usuario.supabaseId) {
      throw new BadRequestException('Usuario no encontrado o no vinculado a Supabase');
    }

    // 2. Validar el PIN contra nuestra base de datos local
    const tokenRecord = await this.tokenRecuperacionService.validarPin(
      codigo,
      usuario.Usuario_id,
    );

    // 3. Si el PIN es válido, actualizar la contraseña en Supabase usando el Service Role
    try {
      await this.supabaseAuthService.cambiarContrasena(
        usuario.supabaseId,
        nuevaContrasena,
      );
      
      // 4. Marcar el PIN como usado solo si el cambio en Supabase fue exitoso
      await this.tokenRecuperacionService.marcarComoUsado(tokenRecord);
    } catch (error) {
      console.error('Error al actualizar contraseña en Supabase:', error);
      throw new BadRequestException(error.message || 'Error al actualizar la contraseña');
    }
  }

  /**
   * Envía un enlace de restablecimiento de contraseña vía Supabase.
   * @param email Correo del usuario.
   * @param redirectTo URL de redirección opcional.
   */
  async restablecerContrasena(email: string, redirectTo?: string): Promise<void> {
    await this.supabaseAuthService.restablecerContrasena(email, redirectTo);
  }

  /**
   * Guarda o actualiza el token de notificaciones push (Expo) de un usuario.
   * @param usuarioId ID del usuario.
   * @param token Token de Expo del dispositivo.
   */
  async guardarPushToken(usuarioId: number, token: string): Promise<void> {
    const usuario = await this.findEntityById(usuarioId);
    usuario.ExpoPushToken = token;
    await this.usuarioRepository.save(usuario);
  }

  /**
   * Actualiza el estado premium de un usuario.
   * @param usuarioId ID del usuario.
   * @param premium true si es premium.
   * @param expira Fecha de expiración.
   */
  async actualizarPremium(usuarioId: number, premium: boolean, expira: Date | null): Promise<void> {
    const usuario = await this.findEntityById(usuarioId);
    usuario.Premium = premium;
    usuario.Expira = expira;
    await this.usuarioRepository.save(usuario);
  }

  // ─── Eliminar ──────────────────────────────────────────────────

  /**
   * Desactiva un usuario (eliminación lógica).
   * @param usuarioId ID del usuario.
   */
  async remove(usuarioId: number): Promise<void> {
    const usuario = await this.findEntityById(usuarioId);
    usuario.Estado = false;
    await this.usuarioRepository.save(usuario);
  }

  /**
   * Obtiene un usuario existente por su token o lo crea si no existe (proveniente de Supabase).
   * @param user Datos del usuario del token.
   * @returns DTO del usuario.
   */
  async getOrCreateFromToken(user: any) {
    let usuario = await this.findBySupabaseId(user.userId);

    if (!usuario) {
      usuario = await this.createFromSupabase({
        email: user.email,
        userId: user.userId,
        nombre: user.nombre,
        apellido: user.apellido,
        foto: user.foto,
      });
    }

    return usuario;
  }
}