import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Suscripcion, EstadoSuscripcion, CicloFacturacion } from './entities/suscripcion.entity';
import { CreateSuscripcionDto } from './dto/create-suscripcion.dto';
import { UpdateSuscripcionDto } from './dto/update-suscripcion.dto';
import { ResponseSuscripcionDto } from './dto/response-suscripcion.dto';
import { UsuarioService } from '../usuario/usuario.service';

@Injectable()
export class SuscripcionService {

  constructor(
    @InjectRepository(Suscripcion)
    private readonly suscripcionRepository: Repository<Suscripcion>,
    private readonly usuarioService: UsuarioService,
  ) {}

  // ─── Mapeo a DTO ───────────────────────────────────────────────

  /**
   * Mapea una entidad Suscripcion a su DTO de respuesta.
   * @param suscripcion Entidad de suscripción.
   * @returns DTO de respuesta.
   */
  private toResponseDto(suscripcion: Suscripcion): ResponseSuscripcionDto {
    return {
      Suscripcion_id: suscripcion.Suscripcion_id,
      Usuario_id: suscripcion.Usuario_id,
      Plan: suscripcion.Plan,
      Facturacion: suscripcion.Facturacion,
      Inicio: suscripcion.Inicio,
      Fin: suscripcion.Fin,
      Estado: suscripcion.Estado,
    };
  }

  // ─── Cálculo de fecha fin ──────────────────────────────────────

  /**
   * Calcula la fecha de fin de la suscripción basada en el ciclo de facturación.
   * @param inicio Fecha de inicio.
   * @param facturacion Ciclo de facturación (MENSUAL/ANUAL).
   * @returns Fecha de fin calculada.
   */
  private calcularFechaFin(inicio: Date, facturacion: CicloFacturacion): Date {
    const fin = new Date(inicio);
    if (facturacion === CicloFacturacion.MENSUAL) {
      fin.setMonth(fin.getMonth() + 1);
    } else if (facturacion === CicloFacturacion.ANUAL) {
      fin.setFullYear(fin.getFullYear() + 1);
    }
    return fin;
  }

  // ─── Consultas ─────────────────────────────────────────────────

  /**
   * Obtiene el historial de suscripciones de un usuario.
   * @param usuarioId ID del usuario.
   * @returns Lista de suscripciones ordenadas por fecha de inicio descendente.
   */
  async findByUsuario(usuarioId: number): Promise<ResponseSuscripcionDto[]> {
    const suscripciones = await this.suscripcionRepository.find({
      where: { Usuario_id: usuarioId },
      order: { Inicio: 'DESC' },
    });
    return suscripciones.map(s => this.toResponseDto(s));
  }

  /**
   * Obtiene la suscripción actualmente activa de un usuario.
   * @param usuarioId ID del usuario.
   * @returns DTO de la suscripción activa o null si no tiene.
   */
  async findActiva(usuarioId: number): Promise<ResponseSuscripcionDto | null> {
    const suscripcion = await this.suscripcionRepository.findOne({
      where: { Usuario_id: usuarioId, Estado: EstadoSuscripcion.ACTIVA },
    });
    return suscripcion ? this.toResponseDto(suscripcion) : null;
  }

  // ─── Crear ─────────────────────────────────────────────────────

  /**
   * Crea una nueva suscripción para un usuario y lo marca como premium.
   * @param datos Datos de la suscripción.
   * @returns Suscripción creada en formato DTO.
   */
  async create(datos: CreateSuscripcionDto): Promise<ResponseSuscripcionDto> {
    await this.usuarioService.findEntityById(datos.Usuario_id);

    const inicio = datos.Inicio ? new Date(datos.Inicio) : new Date();
    const fin = this.calcularFechaFin(inicio, datos.Facturacion);

    const suscripcion = this.suscripcionRepository.create({
      ...datos,
      Inicio: inicio,
      Fin: fin,
      Estado: EstadoSuscripcion.ACTIVA,
    });

    const guardado = await this.suscripcionRepository.save(suscripcion);

    // ← actualizar usuario a premium con fecha de expiración calculada
    await this.usuarioService.actualizarPremium(datos.Usuario_id, true, fin);

    return this.toResponseDto(guardado);
  }

  // ─── Actualizar ────────────────────────────────────────────────

  /**
   * Actualiza los datos de una suscripción existente.
   * @param suscripcionId ID de la suscripción.
   * @param datos Nuevos datos.
   * @returns Suscripción actualizada en formato DTO.
   * @throws NotFoundException si no existe.
   */
  async update(suscripcionId: number, datos: UpdateSuscripcionDto): Promise<ResponseSuscripcionDto> {
    const suscripcion = await this.suscripcionRepository.findOne({
      where: { Suscripcion_id: suscripcionId },
    });
    if (!suscripcion) throw new NotFoundException('Suscripción no encontrada');
    Object.assign(suscripcion, datos);
    const guardado = await this.suscripcionRepository.save(suscripcion);
    return this.toResponseDto(guardado);
  }

  // ─── Vencer ────────────────────────────────────────────────────

  /**
   * Marca una suscripción como vencida y retira el estado premium al usuario.
   * @param suscripcionId ID de la suscripción.
   * @throws NotFoundException si no existe.
   */
  async vencer(suscripcionId: number): Promise<void> {
    const suscripcion = await this.suscripcionRepository.findOne({
      where: { Suscripcion_id: suscripcionId },
    });
    if (!suscripcion) throw new NotFoundException('Suscripción no encontrada');

    suscripcion.Estado = EstadoSuscripcion.VENCIDA;
    suscripcion.Fin = new Date();
    await this.suscripcionRepository.save(suscripcion);

    // ← quitar premium al usuario
    await this.usuarioService.actualizarPremium(suscripcion.Usuario_id, false, null);
  }

  // ─── Cancelar ──────────────────────────────────────────────────

  /**
   * Cancela una suscripción activa y retira el estado premium al usuario.
   * @param suscripcionId ID de la suscripción.
   * @throws NotFoundException si no existe.
   */
  async cancelar(suscripcionId: number): Promise<void> {
    const suscripcion = await this.suscripcionRepository.findOne({
      where: { Suscripcion_id: suscripcionId },
    });
    if (!suscripcion) throw new NotFoundException('Suscripción no encontrada');

    suscripcion.Estado = EstadoSuscripcion.CANCELADA;
    suscripcion.Fin = new Date();
    await this.suscripcionRepository.save(suscripcion);

    // quitar premium al usuario
    await this.usuarioService.actualizarPremium(suscripcion.Usuario_id, false, null);
  }
}