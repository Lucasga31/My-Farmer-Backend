import {
  Controller, Get, Post, Patch, Delete, Param, Body, ParseIntPipe, UseInterceptors, UploadedFile, UseGuards
} from '@nestjs/common';
import { TipoCultivoService } from './tipo_cultivo.service';
import { CreateTipoCultivoDto } from './dto/create-tipo_cultivo.dto';
import { UpdateTipoCultivoDto } from './dto/update-tipo_cultivo.dto';
import { ResponseTipoCultivoDto } from './dto/response-tipo_cultivo.dto';
import { SupabaseAuthGuard } from '../auth/supabase-auth/supabase-auth.guard';
import { File } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('tipos-cultivo')
export class TipoCultivoController {

  constructor(private readonly tipoCultivoService: TipoCultivoService) { }

  /**
   * GET /tipos-cultivo
   * Retorna todos los tipos de cultivo.
   * Body: ninguno
   * Headers: Authorization: Bearer <token_supabase>
   */
  @UseGuards(SupabaseAuthGuard)
  @Get()
  findAll(): Promise<ResponseTipoCultivoDto[]> {
    return this.tipoCultivoService.findAll();
  }

  /**
   * GET /tipos-cultivo/:id
   * Obtiene un tipo de cultivo específico por ID.
   * Params:
   *  - id (obligatorio): ID del tipo de cultivo
   * Body: ninguno
   * Headers: Authorization: Bearer <token_supabase>
   */
  @UseGuards(SupabaseAuthGuard)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<ResponseTipoCultivoDto> {
    return this.tipoCultivoService.findOneDto(id);
  }

  /**
   * POST /tipos-cultivo
   * Crea un nuevo tipo de cultivo.
   * Body: CreateTipoCultivoDto
   *  {
   *    "Nombre": "Maíz",
   *    "Descripcion": "Cultivo de maíz amarillo",
   *    "Icono": archivo
   *  }
   * Headers: Authorization: Bearer <token_supabase>
   * No requiere UsuarioService
   */
  @UseGuards(SupabaseAuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('Icono'))
  create(
    @Body() datos: CreateTipoCultivoDto,
    @UploadedFile() file?: File,
  ): Promise<ResponseTipoCultivoDto> {
    return this.tipoCultivoService.create(datos, file);
  }

  /**
   * PATCH /tipos-cultivo/:id
   * Actualiza un tipo de cultivo específico.
   * Params:
   *  - id (obligatorio): ID del tipo de cultivo
   * Body: UpdateTipoCultivoDto
   *  {
   *    "Nombre": "Maíz Mejorado",
   *    "Descripcion": "Cultivo de maíz con mejor rendimiento",
   *    "Icono": archivo
   *  }
   * Headers: Authorization: Bearer <token_supabase>
   */
  @UseGuards(SupabaseAuthGuard)
  @Patch(':id')
  @UseInterceptors(FileInterceptor('Icono'))
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() datos: UpdateTipoCultivoDto,
    @UploadedFile() file?: File,
  ): Promise<ResponseTipoCultivoDto> {
    return this.tipoCultivoService.update(id, datos, file);
  }

  /**
   * DELETE /tipos-cultivo/:id
   * Elimina un tipo de cultivo específico.
   * Params:
   *  - id (obligatorio): ID del tipo de cultivo
   * Body: ninguno
   * Headers: Authorization: Bearer <token_supabase>
   */
  @UseGuards(SupabaseAuthGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.tipoCultivoService.remove(id);
  }
}