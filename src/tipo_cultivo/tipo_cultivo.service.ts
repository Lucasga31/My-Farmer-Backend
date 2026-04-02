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

  private toResponseDto(tipo: TipoCultivo): ResponseTipoCultivoDto {
    return {
      Tipo_Cultivo_id: tipo.Tipo_Cultivo_id,
      Nombre: tipo.Nombre,
      Descripcion: tipo.Descripcion,
      Icono: tipo.Icono,
      Registro: tipo.Registro,
    };
  }

  async findAll(): Promise<ResponseTipoCultivoDto[]> {
    const tipos = await this.tipoCultivoRepository.find();
    return tipos.map(t => this.toResponseDto(t));
  }

  async findOne(tipoCultivoId: number): Promise<TipoCultivo> {
    const tipo = await this.tipoCultivoRepository.findOne({
      where: { Tipo_Cultivo_id: tipoCultivoId },
    });
    if (!tipo) throw new NotFoundException('Tipo de cultivo no encontrado');
    return tipo;
  }

  async findOneDto(tipoCultivoId: number): Promise<ResponseTipoCultivoDto> {
    const tipo = await this.findOne(tipoCultivoId);
    return this.toResponseDto(tipo);
  }

  async create(datos: CreateTipoCultivoDto, file?: File,): Promise<ResponseTipoCultivoDto> {
    if (file) {
      datos.Icono = await this.fileUploadService.uploadFile(file, 'tipo-cultivo');
    }
    const tipo = this.tipoCultivoRepository.create(datos);
    const guardado = await this.tipoCultivoRepository.save(tipo);
    return this.toResponseDto(guardado);
  }

  async update(tipoCultivoId: number, datos: UpdateTipoCultivoDto, file?: File,): Promise<ResponseTipoCultivoDto> {
    const tipo = await this.findOne(tipoCultivoId);
    if (file) {
      datos.Icono = await this.fileUploadService.uploadFile(file, 'tipo-cultivo');
    }
    Object.assign(tipo, datos);
    const guardado = await this.tipoCultivoRepository.save(tipo);
    return this.toResponseDto(guardado);
  }

  async remove(tipoCultivoId: number): Promise<void> {
    const tipo = await this.findOne(tipoCultivoId);
    await this.tipoCultivoRepository.remove(tipo);
  }
}