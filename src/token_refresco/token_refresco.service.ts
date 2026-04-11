import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TokenRefresco } from './entities/token_refresco.entity';
import { CreateTokenRefrescoDto } from './dto/create-token_refresco.dto';
import { ResponseTokenRefrescoDto } from './dto/response-token_refresco.dto';
import { UsuarioService } from '../usuario/usuario.service';

@Injectable()
export class TokenRefrescoService {

  constructor(
    @InjectRepository(TokenRefresco)
    private readonly tokenRepository: Repository<TokenRefresco>,
    private readonly usuarioService: UsuarioService,
  ) {}

  /**
   * Mapea una entidad TokenRefresco a su DTO de respuesta.
   * @param token Entidad del token de refresco.
   * @returns DTO de respuesta.
   */
  private toResponseDto(token: TokenRefresco): ResponseTokenRefrescoDto {
    return {
      id: token.id,
      Usuario_id: token.Usuario_id,
      Expira: token.Expira,
      Revocado: token.Revocado,
      Registro: token.Registro,
    };
  }

  /**
   * Busca un token de refresco por su hash, asegurando que no haya sido revocado.
   * @param tokenHash Hash del token.
   * @returns Entidad TokenRefresco o null si no existe o fue revocado.
   */
  async findByHash(tokenHash: string): Promise<TokenRefresco | null> {
    return this.tokenRepository.findOne({
      where: { Token_Hash: tokenHash, Revocado: false },
    });
  }

  /**
   * Obtiene todos los tokens de refresco activos (no revocados) de un usuario.
   * @param usuarioId ID del usuario.
   * @returns Lista de tokens en formato DTO.
   */
  async findByUsuario(usuarioId: number): Promise<ResponseTokenRefrescoDto[]> {
    const tokens = await this.tokenRepository.find({
      where: { Usuario_id: usuarioId, Revocado: false },
    });
    return tokens.map(t => this.toResponseDto(t));
  }

  /**
   * Registra un nuevo token de refresco para un usuario.
   * @param datos Datos del token a crear.
   * @returns Token creado en formato DTO.
   */
  async create(datos: CreateTokenRefrescoDto): Promise<ResponseTokenRefrescoDto> {
    await this.usuarioService.findEntityById(datos.Usuario_id);
    const token = this.tokenRepository.create(datos);
    const guardado = await this.tokenRepository.save(token);
    return this.toResponseDto(guardado);
  }

  /**
   * Revoca un token de refresco específico por su ID.
   * @param tokenId ID del token.
   * @throws NotFoundException si no existe.
   */
  async revocar(tokenId: number): Promise<void> {
    const token = await this.tokenRepository.findOne({
      where: { id: tokenId },
    });
    if (!token) throw new NotFoundException('Token no encontrado');
    token.Revocado = true;
    await this.tokenRepository.save(token);
  }

  /**
   * Revoca todos los tokens de refresco activos de un usuario.
   * Útil para cerrar sesión en todos los dispositivos.
   * @param usuarioId ID del usuario.
   */
  async revocarTodosDeUsuario(usuarioId: number): Promise<void> {
    await this.usuarioService.findEntityById(usuarioId);
    await this.tokenRepository.update(
      { Usuario_id: usuarioId, Revocado: false },
      { Revocado: true },
    );
  }
}