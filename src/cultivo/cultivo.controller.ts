import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  Req,
  UseGuards,
  UseInterceptors,
  UploadedFile
} from '@nestjs/common';
import { CultivoService } from './cultivo.service';
import { UsuarioService } from '../usuario/usuario.service';
import { CreateCultivoDto } from './dto/create-cultivo.dto';
import { UpdateCultivoDto } from './dto/update-cultivo.dto';
import { ResponseCultivoDto } from './dto/response-cultivo.dto';
import { SupabaseAuthGuard } from '../auth/supabase-auth/supabase-auth.guard';
import { File } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('cultivos')
export class CultivoController {
  constructor(
    private readonly cultivoService: CultivoService,
    private readonly usuarioService: UsuarioService,
  ) { }

  /**
   * GET /cultivos/activos
   * Retorna todos los cultivos activos del usuario autenticado.
   * Params: ninguno
   * Body: ninguno
   * Headers: Authorization: Bearer <token>
   */
  @UseGuards(SupabaseAuthGuard)
  @Get('activos')
  async findActivos(@Req() req): Promise<ResponseCultivoDto[]> {
    const usuario = await this.usuarioService.getOrCreateFromToken(req.user);
    return this.cultivoService.findActivos(usuario.Usuario_id);
  }

  /**
   * GET /cultivos/historicos
   * Retorna todos los cultivos históricos del usuario autenticado.
   * Params: ninguno
   * Body: ninguno
   * Headers: Authorization: Bearer <token>
   */
  @UseGuards(SupabaseAuthGuard)
  @Get('historicos')
  async findHistoricos(@Req() req): Promise<ResponseCultivoDto[]> {
    const usuario = await this.usuarioService.getOrCreateFromToken(req.user);
    return this.cultivoService.findHistoricos(usuario.Usuario_id);
  }

  /**
   * GET /cultivos/:id
   * Obtiene un cultivo específico del usuario autenticado.
   * Params:
   *  - id (obligatorio): ID del cultivo
   * Body: ninguno
   * Headers: Authorization: Bearer <token>
   */
  @UseGuards(SupabaseAuthGuard)
  @Get(':id')
  async findOne(
    @Req() req,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ResponseCultivoDto> {
    const usuario = await this.usuarioService.getOrCreateFromToken(req.user);
    return this.cultivoService.findOne(id, usuario.Usuario_id);
  }

  /**
   * POST /cultivos
   * Crea un nuevo cultivo para el usuario autenticado.
   * Body:
   * {
      "Nombre": "Maíz Primavera",
      "Estado": "Activo",
      "Fecha_Siembra": "2026-03-01",
      "Fecha_Cosecha_Estimada": "2026-07-15",
      "Rendimiento_Estimado": 2000,
      "Rendimiento_Unidad": "kg",
      "Notas": "Sembrado en parcela sur",
      "Parcela_id": 1,
      "Tipo_Cultivo_id": 2,
      "Foto": archivo
    }
   * Headers: Authorization: Bearer <token>, Content-Type: application/json
   */
  @UseGuards(SupabaseAuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('Foto'))
  async create(
    @Req() req,
    @Body() datos: CreateCultivoDto,
    @UploadedFile() file?: File,
  ): Promise<ResponseCultivoDto> {
    const usuario = await this.usuarioService.getOrCreateFromToken(req.user);
    return this.cultivoService.create(usuario.Usuario_id, datos, file);
  }

  /**
   * PATCH /cultivos/:id
   * Actualiza un cultivo específico del usuario autenticado.
   * Params:
   *  - id (obligatorio): ID del cultivo
   * Body:
   * {
   *   "Nombre": "Maíz Verano",
   *   "Estado": "cosechado",
   *   "Fecha_Cosecha": "2026-07-12",
   *   "Rendimiento_Estimado": 2100,
   *   "Notas": "Cosecha adelantada por clima",
   *   "Activo": true,
   *   "Parcela_id": 1,
   *   "Tipo_Cultivo_id": 2
   * }
   * Headers: Authorization: Bearer <token>, Content-Type: application/json
   */
  @UseGuards(SupabaseAuthGuard)
  @Patch(':id')
  @UseInterceptors(FileInterceptor('Foto'))
  async update(
    @Req() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() datos: UpdateCultivoDto,
    @UploadedFile() file?: File,
  ): Promise<ResponseCultivoDto> {
    const usuario = await this.usuarioService.getOrCreateFromToken(req.user);
    return this.cultivoService.update(id, usuario.Usuario_id, datos, file);
  }

  /**
   * DELETE /cultivos/:id
   * Elimina un cultivo específico del usuario autenticado.
   * Params:
   *  - id (obligatorio): ID del cultivo
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
    return this.cultivoService.remove(id, usuario.Usuario_id);
  }
}