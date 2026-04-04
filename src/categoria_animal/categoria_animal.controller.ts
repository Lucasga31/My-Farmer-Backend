import { Controller, Get, Post, Patch, Delete, Param, Body, ParseIntPipe, Req, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { CategoriaAnimalService } from './categoria_animal.service';
import { UsuarioService } from '../usuario/usuario.service';
import { CreateCategoriaAnimalDto } from './dto/create-categoria_animal.dto';
import { UpdateCategoriaAnimalDto } from './dto/update-categoria_animal.dto';
import { ResponseCategoriaAnimalDto } from './dto/response-categoria_animal.dto';
import { SupabaseAuthGuard } from '../auth/supabase-auth/supabase-auth.guard';
import { FileUploadService } from 'src/auth/supabase-storage/file-upload.service';
import { File } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('categorias-animal')
export class CategoriaAnimalController {

  constructor(
    private readonly categoriaAnimalService: CategoriaAnimalService,
    private readonly usuarioService: UsuarioService,
  ) {}

  /**
   * GET /categorias-animal
   * Obtiene todas las categorías de animales.
   * Body: ninguno
   * Headers: Authorization: Bearer <token>
   */
  @UseGuards(SupabaseAuthGuard)
  @Get()
  findAll(): Promise<ResponseCategoriaAnimalDto[]> {
    return this.categoriaAnimalService.findAll();
  }

  /**
   * GET /categorias-animal/:id
   * Obtiene una categoría específica por su ID.
   * Params:
   *  - id (obligatorio): ID de la categoría
   * Body: ninguno
   * Headers: Authorization: Bearer <token>
   */
  @UseGuards(SupabaseAuthGuard)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<ResponseCategoriaAnimalDto> {
    return this.categoriaAnimalService.findOneDto(id);
  }

  /**
   * POST /categorias-animal
   * Crea una nueva categoría de animal.
   * Body: CreateCategoriaAnimalDto
   *  {
   *    "Nombre": "Perro",
   *    "Descripcion": "Animales domésticos",
   *    "Icono": archivo
   *  }
   * Headers: Authorization: Bearer <token>
   */
  @UseGuards(SupabaseAuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('Icono'))
  create(
    @Body() datos: CreateCategoriaAnimalDto,
    @UploadedFile() file?: File,
  ): Promise<ResponseCategoriaAnimalDto> {
    return this.categoriaAnimalService.create(datos, file);
  }

  /**
   * PATCH /categorias-animal/:id
   * Actualiza una categoría existente.
   * Params:
   *  - id (obligatorio): ID de la categoría
   * Body: UpdateCategoriaAnimalDto
   *  {
   *    "Nombre": "Gato",
   *    "Descripcion": "Animales domésticos felinos",
   *    "Icono": archivo
   *  }
   * Headers: Authorization: Bearer <token>
   */
  @UseGuards(SupabaseAuthGuard)
  @Patch(':id')
  @UseInterceptors(FileInterceptor('Icono'))
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() datos: UpdateCategoriaAnimalDto,
    @UploadedFile() file?: File,
  ): Promise<ResponseCategoriaAnimalDto> {
    return this.categoriaAnimalService.update(id, datos, file);
  }

  /**
   * DELETE /categorias-animal/:id
   * Elimina una categoría específica.
   * Params:
   *  - id (obligatorio): ID de la categoría
   * Body: ninguno
   * Headers: Authorization: Bearer <token>
   */
  @UseGuards(SupabaseAuthGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.categoriaAnimalService.remove(id);
  }
}