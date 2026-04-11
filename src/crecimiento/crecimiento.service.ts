import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Crecimiento } from './entities/crecimiento.entity';
import { Cultivo } from 'src/cultivo/entities/cultivo.entity';
import { CreateCrecimientoDto } from './dto/create-crecimiento.dto';
import { UpdateCrecimientoDto } from './dto/update-crecimiento.dto';
import { ResponseCrecimientoDto } from './dto/response-crecimiento.dto';
import { FileUploadService } from 'src/auth/supabase-storage/file-upload.service';

@Injectable()
export class CrecimientoService {

  constructor(
    @InjectRepository(Crecimiento)
    private readonly crecimientoRepository: Repository<Crecimiento>,
    @InjectRepository(Cultivo)
    private readonly cultivoRepository: Repository<Cultivo>,
    private readonly fileUploadService: FileUploadService,
  ) { }

  /**
   * Mapea una entidad Crecimiento a su DTO de respuesta.
   * @param crecimiento Entidad de crecimiento.
   * @returns DTO de respuesta.
   */
  private toResponseDto(crecimiento: Crecimiento): ResponseCrecimientoDto {
    return {
      Crecimiento_id: crecimiento.Crecimiento_id,
      Cultivo_id: crecimiento.Cultivo_id,
      Altura: crecimiento.Altura,
      Observaciones: crecimiento.Observaciones,
      Foto: crecimiento.Foto,
      Registro: crecimiento.Registro,
    };
  }

  /**
   * Obtiene todos los registros de crecimiento de un cultivo específico.
   * @param cultivoId ID del cultivo.
   * @param usuarioId ID del usuario propietario.
   * @param limit Límite de resultados (máximo 100).
   * @returns Lista de registros de crecimiento en formato DTO.
   * @throws NotFoundException si el cultivo no existe o no pertenece al usuario.
   */
  async findByCultivo(cultivoId: number, usuarioId: number, limit: number = 20): Promise<ResponseCrecimientoDto[]> {
    const limiteFinal = Math.min(limit, 100);

    // Verificar que el cultivo pertenezca al usuario
    const cultivo = await this.cultivoRepository.findOne({
      where: { Cultivo_id: cultivoId, Usuario_id: usuarioId, Eliminado: false },
    });
    if (!cultivo) throw new NotFoundException('Cultivo no encontrado');

    const crecimientos = await this.crecimientoRepository.find({
      where: { Cultivo_id: cultivoId },
      order: { Registro: 'DESC' },
      take: limiteFinal,
    });
    return crecimientos.map(c => this.toResponseDto(c));
  }

  /**
   * Obtiene un registro de crecimiento por su ID.
   * @param crecimientoId ID del registro.
   * @param usuarioId ID del usuario propietario.
   * @returns DTO del registro de crecimiento.
   * @throws NotFoundException si no existe o no pertenece al usuario.
   */
  async findOne(crecimientoId: number, usuarioId: number): Promise<ResponseCrecimientoDto> {
    const crecimiento = await this.crecimientoRepository.findOne({
      where: { Crecimiento_id: crecimientoId },
      relations: ['Cultivo'],
    });

    if (!crecimiento || (crecimiento as any).Cultivo.Usuario_id !== usuarioId) {
      throw new NotFoundException('Registro de crecimiento no encontrado');
    }

    return this.toResponseDto(crecimiento);
  }

  /**
   * Crea un nuevo registro de crecimiento para un cultivo.
   * @param usuarioId ID del usuario.
   * @param datos Datos del crecimiento.
   * @param file (Opcional) Foto del estado del cultivo.
   * @returns Registro creado en formato DTO.
   * @throws NotFoundException si el cultivo no existe.
   */
  async create(
    usuarioId: number,
    datos: CreateCrecimientoDto,
    file?: File,
  ): Promise<ResponseCrecimientoDto> {

    const cultivo = await this.cultivoRepository.findOne({
      where: {
        Cultivo_id: datos.Cultivo_id,
        Usuario_id: usuarioId,
        Eliminado: false,
      },
    });

    if (!cultivo) {
      throw new NotFoundException('Cultivo no encontrado');
    }

    // ── SUBIDA DE IMAGEN ──
    if (file) {
      datos.Foto = await this.fileUploadService.uploadFile(file, 'crecimiento');
    }

    const crecimiento = this.crecimientoRepository.create(datos);
    const guardado = await this.crecimientoRepository.save(crecimiento);

    return this.toResponseDto(guardado);
  }

  /**
   * Actualiza un registro de crecimiento existente.
   * @param crecimientoId ID del registro.
   * @param datos Nuevos datos.
   * @param file (Opcional) Nueva foto.
   * @returns Registro actualizado en formato DTO.
   * @throws NotFoundException si el registro no existe.
   */
  async update(
    crecimientoId: number,
    datos: UpdateCrecimientoDto,
    file?: File,
  ): Promise<ResponseCrecimientoDto> {

    const crecimiento = await this.crecimientoRepository.findOne({
      where: { Crecimiento_id: crecimientoId },
    });

    if (!crecimiento) {
      throw new NotFoundException('Registro de crecimiento no encontrado');
    }

    // ── SUBIDA DE IMAGEN ──
    if (file) {
      datos.Foto = await this.fileUploadService.uploadFile(file, 'crecimiento');
    }

    Object.assign(crecimiento, datos);
    const guardado = await this.crecimientoRepository.save(crecimiento);

    return this.toResponseDto(guardado);
  }

  /**
   * Elimina un registro de crecimiento.
   * @param crecimientoId ID del registro a eliminar.
   * @throws NotFoundException si el registro no existe.
   */
  async remove(crecimientoId: number): Promise<void> {
    const crecimiento = await this.crecimientoRepository.findOne({
      where: { Crecimiento_id: crecimientoId },
    });
    if (!crecimiento) throw new NotFoundException('Registro de crecimiento no encontrado');
    await this.crecimientoRepository.remove(crecimiento);
  }
}