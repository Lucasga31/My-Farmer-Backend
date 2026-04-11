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

  /**
   * Convierte una entidad CategoriaAnimal a su DTO de respuesta.
   * @param categoria Entidad de categoría.
   * @returns DTO de respuesta.
   */
  private toResponseDto(categoria: CategoriaAnimal): ResponseCategoriaAnimalDto {
    return {
      Categoria_Animal_id: categoria.Categoria_Animal_id,
      Nombre: categoria.Nombre,
      Descripcion: categoria.Descripcion,
      Icono: categoria.Icono,
      Registro: categoria.Registro,
    };
  }

  /**
   * Obtiene todas las categorías de animales registradas.
   * @returns Lista de categorías en formato DTO.
   */
  async findAll(): Promise<ResponseCategoriaAnimalDto[]> {
    const categorias = await this.categoriaRepository.find();
    return categorias.map(c => this.toResponseDto(c));
  }

  /**
   * Busca una entidad de categoría por su ID.
   * @param categoriaId ID de la categoría.
   * @returns Entidad CategoriaAnimal.
   * @throws NotFoundException si no se encuentra.
   */
  async findOne(categoriaId: number): Promise<CategoriaAnimal> {
    const categoria = await this.categoriaRepository.findOne({
      where: { Categoria_Animal_id: categoriaId },
    });
    if (!categoria) throw new NotFoundException('Categoría no encontrada');
    return categoria;
  }

  /**
   * Obtiene una categoría por su ID en formato DTO.
   * @param categoriaId ID de la categoría.
   * @returns DTO de la categoría.
   */
  async findOneDto(categoriaId: number): Promise<ResponseCategoriaAnimalDto> {
    const categoria = await this.findOne(categoriaId);
    return this.toResponseDto(categoria);
  }

  /**
   * Crea una nueva categoría de animal.
   * @param datos Datos de la categoría.
   * @param file (Opcional) Icono de la categoría.
   * @returns Categoría creada en formato DTO.
   */
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

  /**
   * Actualiza una categoría de animal existente.
   * @param categoriaId ID de la categoría.
   * @param datos Nuevos datos.
   * @param file (Opcional) Nuevo icono.
   * @returns Categoría actualizada en formato DTO.
   */
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

  /**
   * Elimina una categoría de animal.
   * @param categoriaId ID de la categoría a eliminar.
   */
  async remove(categoriaId: number): Promise<void> {
    const categoria = await this.findOne(categoriaId);
    await this.categoriaRepository.remove(categoria);
  }
}