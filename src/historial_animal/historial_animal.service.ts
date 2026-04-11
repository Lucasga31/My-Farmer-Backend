import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HistorialAnimal } from './entities/historial_animal.entity';
import { HistorialAnimalDto } from './dto/historial-animal.dto';
import { ResponseHistorialAnimalDto } from './dto/response-historial_animal.dto';
import { Animal } from '../animal/entities/animal.entity';

@Injectable()
export class HistorialAnimalService {

  constructor(
    @InjectRepository(HistorialAnimal)
    private readonly historialRepository: Repository<HistorialAnimal>,
    @InjectRepository(Animal)
    private readonly animalRepository: Repository<Animal>,
  ) {}

  /**
   * Mapea una entidad HistorialAnimal a su DTO de respuesta.
   * @param historial Entidad de historial.
   * @returns DTO de respuesta.
   */
  private toResponseDto(historial: HistorialAnimal): ResponseHistorialAnimalDto {
    return {
      Historial_Animal_id: historial.Historial_Animal_id,
      Animal_id: historial.Animal_id,
      Campo_Mod: historial.Campo_Mod,
      Valor_Ant: historial.Valor_Ant,
      Valor_Nue: historial.Valor_Nue,
      Fecha: historial.Fecha,
    };
  }

  /**
   * Obtiene el historial de cambios de un animal específico.
   * Valida que el animal pertenezca al usuario.
   * @param animalId ID del animal.
   * @param usuarioId ID del usuario propietario.
   * @param query DTO de consulta con filtros como límite.
   * @returns Lista de registros de historial en formato DTO.
   * @throws NotFoundException si el animal no existe o no pertenece al usuario.
   */
  async findByAnimal(animalId: number, usuarioId: number, query: HistorialAnimalDto): Promise<ResponseHistorialAnimalDto[]> {
    // Verificar propiedad
    const animal = await this.animalRepository.findOne({
      where: { Animal_id: animalId, Usuario_id: usuarioId, Eliminado: false },
    });
    if (!animal) throw new NotFoundException('Animal no encontrado');

    const limiteFinal = Math.min(query.limit ?? 20, 100);
    const historiales = await this.historialRepository.find({
      where: { Animal_id: animalId },
      order: { Fecha: 'DESC' },
      take: limiteFinal,
    });
    return historiales.map(h => this.toResponseDto(h));
  }
}