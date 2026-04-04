import { Controller, Get, Post, Patch, Delete, Param, Body, Query, ParseIntPipe, Req, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { Request } from 'express';
import { AnimalService } from './animal.service';
import { UsuarioService } from '../usuario/usuario.service';
import { CreateAnimalDto } from './dto/create-animal.dto';
import { UpdateAnimalDto } from './dto/update-animal.dto';
import { ResponseAnimalDto } from './dto/response-animal.dto';
import { SupabaseAuthGuard } from '../auth/supabase-auth/supabase-auth.guard';
import { FileUploadService } from 'src/auth/supabase-storage/file-upload.service';
import { File } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('animales')
export class AnimalController {
  constructor(
    private readonly animalService: AnimalService,
    private readonly usuarioService: UsuarioService,
    private readonly fileUploadService: FileUploadService,
  ) { }

  /**
   * GET /animales
   * Retorna todos los animales del usuario autenticado.
   * Body: ninguno
   * Headers: Authorization: Bearer <token>
   */
  @UseGuards(SupabaseAuthGuard)
  @Get()
  async findAll(@Req() req): Promise<ResponseAnimalDto[]> {
    const usuario = await this.usuarioService.getOrCreateFromToken(req.user);
    return this.animalService.findAll(usuario.Usuario_id);
  }

  /**
   * GET /animales/buscar?nombre=&color=&categoriaId=&limit=
   * Busca animales del usuario con filtros opcionales.
   * Query params:
   *  - nombre (opcional)
   *  - color (opcional)
   *  - categoriaId (opcional)
   *  - limit (opcional)
   * Body: ninguno
   * Headers: Authorization: Bearer <token>
   */
  @UseGuards(SupabaseAuthGuard)
  @Get('buscar')
  async buscar(
    @Req() req,
    @Query('nombre') nombre?: string,
    @Query('color') color?: string,
    @Query('categoriaId') categoriaId?: number,
    @Query('limit') limit?: number,
  ): Promise<ResponseAnimalDto[]> {
    const usuario = await this.usuarioService.getOrCreateFromToken(req.user);
    return this.animalService.buscar(
      usuario.Usuario_id,
      nombre,
      color,
      categoriaId,
      limit,
    );
  }

  /**
   * GET /animales/:id
   * Obtiene un animal específico del usuario autenticado.
   * Params:
   *  - id (obligatorio): ID del animal
   * Body: ninguno
   * Headers: Authorization: Bearer <token>
   */
  @UseGuards(SupabaseAuthGuard)
  @Get(':id')
  async findOne(
    @Req() req,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ResponseAnimalDto> {
    const usuario = await this.usuarioService.getOrCreateFromToken(req.user);
    return this.animalService.findOne(id, usuario.Usuario_id);
  }

  /**
   * POST /animales
   * Crea un nuevo animal para el usuario autenticado.
   * Body: CreateAnimalDto
   *  {
   *    "nombre": "Firulais",
   *    "color": "Marrón",
   *    "categoriaId": 1,
   *    "edad": 3,
   *    "foto": archivo
   *  }
   * Headers: Authorization: Bearer <token>
   */
  @UseGuards(SupabaseAuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('Foto'))
  async create(
    @Req() req,
    @Body() datos: CreateAnimalDto,
    @UploadedFile() file?: File,
  ) {
    const usuario = await this.usuarioService.getOrCreateFromToken(req.user);
    return this.animalService.create(usuario.Usuario_id, datos, file);
  }

  /**
   * PATCH /animales/:id
   * Actualiza un animal específico del usuario autenticado.
   * Params:
   *  - id (obligatorio): ID del animal
   * Body: UpdateAnimalDto
   *  {
   *    "nombre": "NuevoNombre",
   *    "color": "Negro",
   *    "edad": 4,
   *    "foto": archivo
   *  }
   * Headers: Authorization: Bearer <token>
   */
  @UseGuards(SupabaseAuthGuard)
  @Patch(':id')
  @UseInterceptors(FileInterceptor('Foto')) // coincidencia con DTO
  async update(
    @Req() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() datos: UpdateAnimalDto,
    @UploadedFile() file?: File,
  ) {
    const usuario = await this.usuarioService.getOrCreateFromToken(req.user);
    return this.animalService.update(id, usuario.Usuario_id, datos, file);
  }

  /**
   * DELETE /animales/:id
   * Elimina un animal específico del usuario autenticado.
   * Params:
   *  - id (obligatorio): ID del animal
   * Body: ninguno
   * Headers: Authorization: Bearer <token>
   */
  @UseGuards(SupabaseAuthGuard)
  @Delete(':id')
  async remove(
    @Req() req,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    const usuario = await this.usuarioService.getOrCreateFromToken(req.user);
    return this.animalService.remove(id, usuario.Usuario_id);
  }
}