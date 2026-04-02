import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoriaAnimal } from './entities/categoria_animal.entity';
import { CreateCategoriaAnimalDto } from './dto/create-categoria_animal.dto';
import { UpdateCategoriaAnimalDto } from './dto/update-categoria_animal.dto';
import { ResponseCategoriaAnimalDto } from './dto/response-categoria_animal.dto';
import { FileUploadService } from 'src/auth/supabase-storage/file-upload.service';

@Injectable()
export class CategoriaAnimalService {

  constructor(
    @InjectRepository(CategoriaAnimal)
    private readonly categoriaRepository: Repository<CategoriaAnimal>,
    private readonly fileUploadService: FileUploadService,
  ) { }

  private toResponseDto(categoria: CategoriaAnimal): ResponseCategoriaAnimalDto {
    return {
      Categoria_Animal_id: categoria.Categoria_Animal_id,
      Nombre: categoria.Nombre,
      Descripcion: categoria.Descripcion,
      Icono: categoria.Icono,
      Registro: categoria.Registro,
    };
  }

  async findAll(): Promise<ResponseCategoriaAnimalDto[]> {
    const categorias = await this.categoriaRepository.find();
    return categorias.map(c => this.toResponseDto(c));
  }

  async findOne(categoriaId: number): Promise<CategoriaAnimal> {
    const categoria = await this.categoriaRepository.findOne({
      where: { Categoria_Animal_id: categoriaId },
    });
    if (!categoria) throw new NotFoundException('Categoría no encontrada');
    return categoria;
  }

  async findOneDto(categoriaId: number): Promise<ResponseCategoriaAnimalDto> {
    const categoria = await this.findOne(categoriaId);
    return this.toResponseDto(categoria);
  }

  async create(
    datos: CreateCategoriaAnimalDto,
    file?: File,
  ): Promise<ResponseCategoriaAnimalDto> {

    // ── SUBIDA SOLO SI HAY ARCHIVO ──
    if (file) {
      datos.Icono = await this.fileUploadService.uploadFile(file, 'categorias-animal');
    }

    const categoria = this.categoriaRepository.create(datos);
    const guardado = await this.categoriaRepository.save(categoria);

    return this.toResponseDto(guardado);
  }

  async update(
    categoriaId: number,
    datos: UpdateCategoriaAnimalDto,
    file?: File,
  ): Promise<ResponseCategoriaAnimalDto> {

    const categoria = await this.findOne(categoriaId);

    // ── SUBIDA SOLO SI HAY ARCHIVO ──
    if (file) {
      datos.Icono = await this.fileUploadService.uploadFile(file, 'categorias-animal');
    }

    Object.assign(categoria, datos);
    const guardado = await this.categoriaRepository.save(categoria);

    return this.toResponseDto(guardado);
  }

  async remove(categoriaId: number): Promise<void> {
    const categoria = await this.findOne(categoriaId);
    await this.categoriaRepository.remove(categoria);
  }
}