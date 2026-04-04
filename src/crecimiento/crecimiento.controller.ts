import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  ParseIntPipe,
  Req,
  UseGuards,
  UseInterceptors, 
  UploadedFile
} from '@nestjs/common';
import { CrecimientoService } from './crecimiento.service';
import { UsuarioService } from '../usuario/usuario.service';
import { CreateCrecimientoDto } from './dto/create-crecimiento.dto';
import { UpdateCrecimientoDto } from './dto/update-crecimiento.dto';
import { ResponseCrecimientoDto } from './dto/response-crecimiento.dto';
import { SupabaseAuthGuard } from '../auth/supabase-auth/supabase-auth.guard';
import { File } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('crecimiento')
export class CrecimientoController {
  constructor(
    private readonly crecimientoService: CrecimientoService,
    private readonly usuarioService: UsuarioService,
  ) {}

  /**
   * GET /crecimiento/cultivo/:cultivoId?limit=
   * Retorna los registros de crecimiento de un cultivo.
   * Params:
   *  - cultivoId (obligatorio): ID del cultivo
   * Query:
   *  - limit (opcional): número de registros a retornar
   * Body: ninguno
   * Headers: Authorization: Bearer <token>
   */
  @UseGuards(SupabaseAuthGuard)
  @Get('cultivo/:cultivoId')
  async findByCultivo(
    @Req() req,
    @Param('cultivoId', ParseIntPipe) cultivoId: number,
    @Query('limit') limit?: number,
  ): Promise<ResponseCrecimientoDto[]> {
    const usuario = await this.usuarioService.getOrCreateFromToken(req.user);
    return this.crecimientoService.findByCultivo(cultivoId, usuario.Usuario_id, limit);
  }

  /**
   * GET /crecimiento/:id
   * Obtiene un registro de crecimiento específico.
   * Params:
   *  - id (obligatorio): ID del crecimiento
   * Body: ninguno
   * Headers: Authorization: Bearer <token>
   */
  @UseGuards(SupabaseAuthGuard)
  @Get(':id')
  async findOne(
    @Req() req,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ResponseCrecimientoDto> {
    const usuario = await this.usuarioService.getOrCreateFromToken(req.user);
    return this.crecimientoService.findOne(id, usuario.Usuario_id);
  }

  /**
   * POST /crecimiento
   * Crea un registro de crecimiento asociado al usuario autenticado.
   * Body:
   * {
   *   "Cultivo_id": 1,
   *   "Altura": 35.5,
   *   "Observaciones": "Crecimiento saludable",
   *   "Foto": archivo
   * }
   * Headers: Authorization: Bearer <token>, Content-Type: application/json
   */
  @UseGuards(SupabaseAuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('Foto'))
  async create(
    @Req() req,
    @Body() datos: CreateCrecimientoDto,
    @UploadedFile() file?: File,
  ): Promise<ResponseCrecimientoDto> {
    const usuario = await this.usuarioService.getOrCreateFromToken(req.user);
    return this.crecimientoService.create(usuario.Usuario_id, datos, file);
  }

  /**
   * PATCH /crecimiento/:id
   * Actualiza un registro de crecimiento.
   * Params:
   *  - id (obligatorio): ID del crecimiento
   * Body:
   * {
   *   "Altura": 40.2,
   *   "Observaciones": "Aumento notable",
   *   "Foto": archivo
   * }
   * Headers: Authorization: Bearer <token>, Content-Type: application/json
   */
  @UseGuards(SupabaseAuthGuard)
  @Patch(':id')
  @UseInterceptors(FileInterceptor('Foto'))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() datos: UpdateCrecimientoDto,
    @UploadedFile() file?: File,
  ): Promise<ResponseCrecimientoDto> {
    return this.crecimientoService.update(id, datos, file);
  }

  /**
   * DELETE /crecimiento/:id
   * Elimina un registro de crecimiento.
   * Params:
   *  - id (obligatorio): ID del crecimiento
   * Body: ninguno
   * Headers: Authorization: Bearer <token>
   */
  @UseGuards(SupabaseAuthGuard)
  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    return this.crecimientoService.remove(id);
  }
}