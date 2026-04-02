import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HistorialCultivo } from './entities/historial_cultivo.entity';
import { HistorialCultivoDto } from './dto/historial-cultivo.dto';
import { ResponseHistorialCultivoDto } from './dto/response-historial_cultivo.dto';
import { Cultivo } from '../cultivo/entities/cultivo.entity';

@Injectable()
export class HistorialCultivoService {

  constructor(
    @InjectRepository(HistorialCultivo)
    private readonly historialRepository: Repository<HistorialCultivo>,
    @InjectRepository(Cultivo)
    private readonly cultivoRepository: Repository<Cultivo>,
  ) {}

  private toResponseDto(historial: HistorialCultivo): ResponseHistorialCultivoDto {
    return {
      Historial_Cultivo_id: historial.Historial_Cultivo_id,
      Cultivo_id: historial.Cultivo_id,
      Campo_Mod: historial.Campo_Mod,
      Valor_Ant: historial.Valor_Ant,
      Valor_Nue: historial.Valor_Nue,
      Fecha: historial.Fecha,
    };
  }

  async findByCultivo(cultivoId: number, usuarioId: number, query: HistorialCultivoDto): Promise<ResponseHistorialCultivoDto[]> {
    // Verificar propiedad
    const cultivo = await this.cultivoRepository.findOne({
      where: { Cultivo_id: cultivoId, Usuario_id: usuarioId, Eliminado: false },
    });
    if (!cultivo) throw new NotFoundException('Cultivo no encontrado');

    const limiteFinal = Math.min(query.limit ?? 20, 100);
    const historiales = await this.historialRepository.find({
      where: { Cultivo_id: cultivoId },
      order: { Fecha: 'DESC' },
      take: limiteFinal,
    });
    return historiales.map(h => this.toResponseDto(h));
  }
}