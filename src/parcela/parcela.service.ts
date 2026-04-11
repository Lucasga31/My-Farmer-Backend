import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Parcela } from './entities/parcela.entity';
import { CreateParcelaDto } from './dto/create-parcela.dto';
import { UpdateParcelaDto } from './dto/update-parcela.dto';
import { ResponseParcelaDto } from './dto/response-parcela.dto';

@Injectable()
export class ParcelaService {

  constructor(
    @InjectRepository(Parcela)
    private readonly parcelaRepository: Repository<Parcela>,
  ) {}

  /**
   * Mapea una entidad Parcela a su DTO de respuesta.
   * @param parcela Entidad de parcela.
   * @returns DTO de respuesta.
   */
  private toResponseDto(parcela: Parcela): ResponseParcelaDto {
    return {
      Parcela_id: parcela.Parcela_id,
      Nombre: parcela.Nombre,
      Area: parcela.Area,
      Descripcion: parcela.Descripcion,
      Latitud: parcela.Latitud,
      Longitud: parcela.Longitud,
      Poligono: parcela.Poligono,
      Activa: parcela.Activa,
      Registro: parcela.Registro,
      Actualizado: parcela.Actualizado,
    };
  }

  /**
   * Busca una entidad de parcela por su ID y el ID del usuario.
   * @param parcelaId ID de la parcela.
   * @param usuarioId ID del usuario propietario.
   * @returns Entidad Parcela.
   * @throws NotFoundException si no se encuentra o no está activa.
   */
  async findEntity(parcelaId: number, usuarioId: number): Promise<Parcela> {
    const parcela = await this.parcelaRepository.findOne({
      where: { Parcela_id: parcelaId, Usuario_id: usuarioId, Activa: true },
    });
    if (!parcela) throw new NotFoundException('Parcela no encontrada');
    return parcela;
  }

  /**
   * Obtiene todas las parcelas activas de un usuario.
   * @param usuarioId ID del usuario.
   * @returns Lista de parcelas en formato DTO.
   */
  async findAll(usuarioId: number): Promise<ResponseParcelaDto[]> {
    const parcelas = await this.parcelaRepository.find({
      where: { Usuario_id: usuarioId, Activa: true },
      order: { Registro: 'DESC' },
    });
    return parcelas.map(p => this.toResponseDto(p));
  }

  /**
   * Obtiene la información de una parcela por su ID.
   * @param parcelaId ID de la parcela.
   * @param usuarioId ID del usuario propietario.
   * @returns DTO de la parcela.
   */
  async findOne(parcelaId: number, usuarioId: number): Promise<ResponseParcelaDto> {
    const parcela = await this.findEntity(parcelaId, usuarioId);
    return this.toResponseDto(parcela);
  }

  /**
   * Crea una nueva parcela para un usuario.
   * @param usuarioId ID del usuario.
   * @param datos Datos de la nueva parcela.
   * @returns Parcela creada en formato DTO.
   */
  async create(usuarioId: number, datos: CreateParcelaDto): Promise<ResponseParcelaDto> {
    const parcela = this.parcelaRepository.create({ ...datos, Usuario_id: usuarioId });
    const guardado = await this.parcelaRepository.save(parcela);
    return this.toResponseDto(guardado);
  }

  /**
   * Actualiza la información de una parcela existente.
   * @param parcelaId ID de la parcela.
   * @param usuarioId ID del usuario propietario.
   * @param datos Nuevos datos de la parcela.
   * @returns Parcela actualizada en formato DTO.
   */
  async update(parcelaId: number, usuarioId: number, datos: UpdateParcelaDto): Promise<ResponseParcelaDto> {
    const parcela = await this.findEntity(parcelaId, usuarioId);
    Object.assign(parcela, datos);
    const guardado = await this.parcelaRepository.save(parcela);
    return this.toResponseDto(guardado);
  }

  /**
   * Realiza la desactivación (eliminación lógica) de una parcela.
   * @param parcelaId ID de la parcela.
   * @param usuarioId ID del usuario propietario.
   */
  async remove(parcelaId: number, usuarioId: number): Promise<void> {
    const parcela = await this.findEntity(parcelaId, usuarioId);
    parcela.Activa = false;
    await this.parcelaRepository.save(parcela);
  }
}