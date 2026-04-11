import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TipoCultivo } from './entities/tipo_cultivo.entity';
import { CreateTipoCultivoDto } from './dto/create-tipo_cultivo.dto';
import { UpdateTipoCultivoDto } from './dto/update-tipo_cultivo.dto';
import { ResponseTipoCultivoDto } from './dto/response-tipo_cultivo.dto';
import { FileUploadService } from 'src/auth/supabase-storage/file-upload.service';

@Injectable()
export class TipoCultivoService {

  constructor(
    @InjectRepository(TipoCultivo)
    private readonly tipoCultivoRepository: Repository<TipoCultivo>,
    private readonly fileUploadService: FileUploadService,
  ) { }

  /**
   * Mapea una entidad TipoCultivo a su DTO de respuesta.
   * @param tipo Entidad de tipo de cultivo.
   * @returns DTO de respuesta.
   */
  private toResponseDto(tipo: TipoCultivo): ResponseTipoCultivoDto {
    return {
      Tipo_Cultivo_id: tipo.Tipo_Cultivo_id,
      Nombre: tipo.Nombre,
      Descripcion: tipo.Descripcion,
      Icono: tipo.Icono,
      Registro: tipo.Registro,
    };
  }

  /**
   * Obtiene todos los tipos de cultivo registrados.
   * @returns Lista de tipos de cultivo en formato DTO.
   */
  async findAll(): Promise<ResponseTipoCultivoDto[]> {
    const tipos = await this.tipoCultivoRepository.find();
    return tipos.map(t => this.toResponseDto(t));
  }

  /**
   * Busca una entidad de tipo de cultivo por su ID.
   * @param tipoCultivoId ID del tipo de cultivo.
   * @returns Entidad TipoCultivo.
   * @throws NotFoundException si no existe.
   */
  async findOne(tipoCultivoId: number): Promise<TipoCultivo> {
    const tipo = await this.tipoCultivoRepository.findOne({
      where: { Tipo_Cultivo_id: tipoCultivoId },
    });
    if (!tipo) throw new NotFoundException('Tipo de cultivo no encontrado');
    return tipo;
  }

  /**
   * Obtiene la información de un tipo de cultivo por su ID en formato DTO.
   * @param tipoCultivoId ID del tipo de cultivo.
   * @returns DTO del tipo de cultivo.
   */
  async findOneDto(tipoCultivoId: number): Promise<ResponseTipoCultivoDto> {
    const tipo = await this.findOne(tipoCultivoId);
    return this.toResponseDto(tipo);
  }

  /**
   * Crea un nuevo tipo de cultivo.
   * @param datos Datos del tipo de cultivo.
   * @param file (Opcional) Icono para el tipo de cultivo.
   * @returns Tipo de cultivo creado en formato DTO.
   */
  async create(datos: CreateTipoCultivoDto, file?: File,): Promise<ResponseTipoCultivoDto> {
    if (file) {
      datos.Icono = await this.fileUploadService.uploadFile(file, 'tipo-cultivo');
    }
    const tipo = this.tipoCultivoRepository.create(datos);
    const guardado = await this.tipoCultivoRepository.save(tipo);
    return this.toResponseDto(guardado);
  }

  /**
   * Actualiza la información de un tipo de cultivo existente.
   * @param tipoCultivoId ID del tipo de cultivo.
   * @param datos Nuevos datos.
   * @param file (Opcional) Nuevo icono.
   * @returns Tipo de cultivo actualizado en formato DTO.
   */
  async update(tipoCultivoId: number, datos: UpdateTipoCultivoDto, file?: File,): Promise<ResponseTipoCultivoDto> {
    const tipo = await this.findOne(tipoCultivoId);
    if (file) {
      datos.Icono = await this.fileUploadService.uploadFile(file, 'tipo-cultivo');
    }
    Object.assign(tipo, datos);
    const guardado = await this.tipoCultivoRepository.save(tipo);
    return this.toResponseDto(guardado);
  }

  /**
   * Elimina un tipo de cultivo.
   * @param tipoCultivoId ID del tipo de cultivo a eliminar.
   */
  async remove(tipoCultivoId: number): Promise<void> {
    const tipo = await this.findOne(tipoCultivoId);
    await this.tipoCultivoRepository.remove(tipo);
  }
}