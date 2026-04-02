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

  async update(cosechaId: number, datos: UpdateCosechaDto): Promise<ResponseCosechaDto> {
    const cosecha = await this.cosechaRepository.findOne({
      where: { Cosecha_id: cosechaId },
    });
    if (!cosecha) throw new NotFoundException('Cosecha no encontrada');
    Object.assign(cosecha, datos);
    const guardado = await this.cosechaRepository.save(cosecha);
    return this.toResponseDto(guardado);
  }

  async remove(cosechaId: number): Promise<void> {
    const cosecha = await this.cosechaRepository.findOne({
      where: { Cosecha_id: cosechaId },
    });
    if (!cosecha) throw new NotFoundException('Cosecha no encontrada');
    await this.cosechaRepository.remove(cosecha);
  }
}