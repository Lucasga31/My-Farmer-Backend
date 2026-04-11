import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cosecha } from './entities/cosecha.entity';
import { Cultivo, EstadoCultivo } from '../cultivo/entities/cultivo.entity';
import { CreateCosechaDto } from './dto/create-cosecha.dto';
import { UpdateCosechaDto } from './dto/update-cosecha.dto';
import { ResponseCosechaDto } from './dto/response-cosecha.dto';

@Injectable()
export class CosechaService {

  constructor(
    @InjectRepository(Cosecha)
    private readonly cosechaRepository: Repository<Cosecha>,
    @InjectRepository(Cultivo)
    private readonly cultivoRepository: Repository<Cultivo>,
  ) {}

  /**
   * Mapea una entidad Cosecha a su DTO de respuesta.
   * @param cosecha Entidad de cosecha.
   * @returns DTO de respuesta.
   */
  private toResponseDto(cosecha: Cosecha): ResponseCosechaDto {
    return {
      Cosecha_id: cosecha.Cosecha_id,
      Cultivo_id: cosecha.Cultivo_id,
      Fecha: cosecha.Fecha,
      Cantidad: cosecha.Cantidad,
      Unidad: cosecha.Unidad,
      Observaciones: cosecha.Observaciones,
      Registro: cosecha.Registro,
    };
  }

  /**
   * Obtiene las cosechas asociadas a un cultivo específico.
   * @param cultivoId ID del cultivo.
   * @param usuarioId ID del usuario propietario.
   * @param limit Límite de resultados (máximo 100).
   * @returns Lista de cosechas en formato DTO.
   * @throws NotFoundException si el cultivo no existe o no pertenece al usuario.
   */
  async findByCultivo(cultivoId: number, usuarioId: number, limit: number = 20): Promise<ResponseCosechaDto[]> {
    const limiteFinal = Math.min(limit, 100);
    
    // Verificar que el cultivo pertenezca al usuario
    const cultivo = await this.cultivoRepository.findOne({
      where: { Cultivo_id: cultivoId, Usuario_id: usuarioId, Eliminado: false },
    });
    if (!cultivo) throw new NotFoundException('Cultivo no encontrado');

    const cosechas = await this.cosechaRepository.find({
      where: { Cultivo_id: cultivoId },
      order: { Fecha: 'DESC' },
      take: limiteFinal,
    });
    return cosechas.map(c => this.toResponseDto(c));
  }

  /**
   * Obtiene la información de una cosecha por su ID.
   * @param cosechaId ID de la cosecha.
   * @param usuarioId ID del usuario propietario.
   * @returns DTO de la cosecha.
   * @throws NotFoundException si la cosecha no existe o no pertenece al usuario.
   */
  async findOne(cosechaId: number, usuarioId: number): Promise<ResponseCosechaDto> {
    const cosecha = await this.cosechaRepository.findOne({
      where: { Cosecha_id: cosechaId },
      relations: ['Cultivo'],
    });
    
    if (!cosecha || (cosecha as any).Cultivo.Usuario_id !== usuarioId) {
      throw new NotFoundException('Cosecha no encontrada');
    }
    
    return this.toResponseDto(cosecha);
  }

  /**
   * Registra una nueva cosecha para un cultivo.
   * Solo permite registrar si el cultivo está en estado COSECHADO.
   * @param usuarioId ID del usuario.
   * @param datos Datos de la cosecha.
   * @returns Cosecha creada en formato DTO.
   * @throws NotFoundException si el cultivo no existe.
   * @throws BadRequestException si el cultivo no está en estado COSECHADO.
   */
  async create(usuarioId: number, datos: CreateCosechaDto): Promise<ResponseCosechaDto> {
    const cultivo = await this.cultivoRepository.findOne({
      where: { Cultivo_id: datos.Cultivo_id, Usuario_id: usuarioId, Eliminado: false },
    });
    if (!cultivo) throw new NotFoundException('Cultivo no encontrado');
    if (cultivo.Estado !== EstadoCultivo.COSECHADO) {
      throw new BadRequestException('Solo se puede registrar cosecha si el cultivo está cosechado');
    }
    const cosecha = this.cosechaRepository.create(datos);
    const guardado = await this.cosechaRepository.save(cosecha);
    return this.toResponseDto(guardado);
  }

  /**
   * Actualiza la información de una cosecha existente.
   * @param cosechaId ID de la cosecha.
   * @param datos Nuevos datos.
   * @returns Cosecha actualizada en formato DTO.
   * @throws NotFoundException si la cosecha no existe.
   */
  async update(cosechaId: number, datos: UpdateCosechaDto): Promise<ResponseCosechaDto> {
    const cosecha = await this.cosechaRepository.findOne({
      where: { Cosecha_id: cosechaId },
    });
    if (!cosecha) throw new NotFoundException('Cosecha no encontrada');
    Object.assign(cosecha, datos);
    const guardado = await this.cosechaRepository.save(cosecha);
    return this.toResponseDto(guardado);
  }

  /**
   * Elimina un registro de cosecha.
   * @param cosechaId ID de la cosecha a eliminar.
   * @throws NotFoundException si la cosecha no existe.
   */
  async remove(cosechaId: number): Promise<void> {
    const cosecha = await this.cosechaRepository.findOne({
      where: { Cosecha_id: cosechaId },
    });
    if (!cosecha) throw new NotFoundException('Cosecha no encontrada');
    await this.cosechaRepository.remove(cosecha);
  }
}