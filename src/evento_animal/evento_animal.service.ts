import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventoAnimal } from './entities/evento_animal.entity';
import { Animal } from 'src/animal/entities/animal.entity';
import { CreateEventoAnimalDto } from './dto/create-evento_animal.dto';
import { UpdateEventoAnimalDto } from './dto/update-evento_animal.dto';
import { ResponseEventoAnimalDto } from './dto/response-evento-animal.dto';
import { FileUploadService } from 'src/auth/supabase-storage/file-upload.service';

@Injectable()
export class EventoAnimalService {

  constructor(
    @InjectRepository(EventoAnimal)
    private readonly eventoRepository: Repository<EventoAnimal>,
    @InjectRepository(Animal)
    private readonly animalRepository: Repository<Animal>,
    private readonly fileUploadService: FileUploadService,
  ) { }

  // ─── Mapeo a DTO ───────────────────────────────────────────────

  private toResponseDto(evento: EventoAnimal): ResponseEventoAnimalDto {
    return {
      Evento_id: evento.Evento_id,
      Animal_id: evento.Animal_id,
      Titulo: evento.Titulo,
      Descripcion: evento.Descripcion,
      Fecha: evento.Fecha,
      Tipo: evento.Tipo,
      Foto: evento.Foto,
      Registro: evento.Registro,
    };
  }

  // ─── Validación de animal ──────────────────────────────────────

  private async validarAnimal(
    animalId: number,
    usuarioId: number,
  ): Promise<Animal> {
    const animal = await this.animalRepository.findOne({
      where: { Animal_id: animalId, Usuario_id: usuarioId, Eliminado: false },
    });
    if (!animal) throw new NotFoundException('Animal no encontrado');
    return animal;
  }

  // ─── Consultas ─────────────────────────────────────────────────

  async findByAnimal(
    animalId: number,
    usuarioId: number,
    limit: number = 20,
  ): Promise<ResponseEventoAnimalDto[]> {
    await this.validarAnimal(animalId, usuarioId);
    const limiteFinal = Math.min(limit, 100);
    const eventos = await this.eventoRepository.find({
      where: { Animal_id: animalId, Eliminado: false }, // ← filtrar eliminados
      order: { Fecha: 'DESC' },
      take: limiteFinal,
    });
    return eventos.map(e => this.toResponseDto(e));
  }

  async findOne(
    eventoId: number,
    usuarioId: number,
  ): Promise<ResponseEventoAnimalDto> {
    const evento = await this.eventoRepository.findOne({
      where: { Evento_id: eventoId, Usuario_id: usuarioId, Eliminado: false }, // ← filtrar eliminados
    });
    if (!evento) throw new NotFoundException('Evento no encontrado');
    return this.toResponseDto(evento);
  }

  // ─── Crear ─────────────────────────────────────────────────────

  async create(
    usuarioId: number,
    datos: CreateEventoAnimalDto,
    file?: File,
  ): Promise<ResponseEventoAnimalDto> {
    await this.validarAnimal(datos.Animal_id, usuarioId);

    if (file) {
      datos.Foto = await this.fileUploadService.uploadFile(file, 'evento');
    }
    const evento = this.eventoRepository.create({
      ...datos,
      Usuario_id: usuarioId,
    });
    const guardado = await this.eventoRepository.save(evento);
    return this.toResponseDto(guardado);
  }

  // ─── Actualizar ────────────────────────────────────────────────

  async update(
    eventoId: number,
    usuarioId: number,
    datos: UpdateEventoAnimalDto,
    file?: File,
  ): Promise<ResponseEventoAnimalDto> {
    const evento = await this.eventoRepository.findOne({
      where: { Evento_id: eventoId, Usuario_id: usuarioId, Eliminado: false }, // ← filtrar eliminados
    });
    if (!evento) throw new NotFoundException('Evento no encontrado');

    if (file) {
      datos.Foto = await this.fileUploadService.uploadFile(file, 'evento');
    }
    
    Object.assign(evento, datos);
    const guardado = await this.eventoRepository.save(evento);
    return this.toResponseDto(guardado);
  }

  // ─── Eliminar lógico ───────────────────────────────────────────

  async remove(eventoId: number, usuarioId: number): Promise<void> {
    const evento = await this.eventoRepository.findOne({
      where: { Evento_id: eventoId, Usuario_id: usuarioId, Eliminado: false },
    });
    if (!evento) throw new NotFoundException('Evento no encontrado');
    evento.Eliminado = true; // ← borrado lógico
    await this.eventoRepository.save(evento);
  }

  // ─── Eliminar lógico por animal ────────────────────────────────

  async eliminarPorAnimal(animalId: number): Promise<void> {
    await this.eventoRepository.update(
      { Animal_id: animalId, Eliminado: false },
      { Eliminado: true },
    );
  }
}