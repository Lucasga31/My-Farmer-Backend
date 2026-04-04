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
} from '@nestjs/common';
import { CosechaService } from './cosecha.service';
import { UsuarioService } from '../usuario/usuario.service';
import { CreateCosechaDto } from './dto/create-cosecha.dto';
import { UpdateCosechaDto } from './dto/update-cosecha.dto';
import { ResponseCosechaDto } from './dto/response-cosecha.dto';
import { SupabaseAuthGuard } from '../auth/supabase-auth/supabase-auth.guard';

@Controller('cosechas')
export class CosechaController {
  constructor(
    private readonly cosechaService: CosechaService,
    private readonly usuarioService: UsuarioService,
  ) {}

  /**
   * GET /cosechas/cultivo/:cultivoId?limit=
   * Retorna las cosechas de un cultivo específico.
   * Params:
   *  - cultivoId (obligatorio): ID del cultivo
   * Query:
   *  - limit (opcional): número de registros
   * Body: ninguno
   * Headers: Authorization: Bearer <token>
   */
  @UseGuards(SupabaseAuthGuard)
  @Get('cultivo/:cultivoId')
  async findByCultivo(
    @Req() req,
    @Param('cultivoId', ParseIntPipe) cultivoId: number,
    @Query('limit') limit?: number,
  ): Promise<ResponseCosechaDto[]> {
    const usuario = await this.usuarioService.getOrCreateFromToken(req.user);
    return this.cosechaService.findByCultivo(cultivoId, usuario.Usuario_id, limit);
  }

  /**
   * GET /cosechas/:id
   * Obtiene una cosecha específica.
   * Params:
   *  - id (obligatorio): ID de la cosecha
   * Body: ninguno
   * Headers: Authorization: Bearer <token>
   */
  @UseGuards(SupabaseAuthGuard)
  @Get(':id')
  async findOne(
    @Req() req,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ResponseCosechaDto> {
    const usuario = await this.usuarioService.getOrCreateFromToken(req.user);
    return this.cosechaService.findOne(id, usuario.Usuario_id);
  }

  /**
   * POST /cosechas
   * Crea una nueva cosecha para el usuario autenticado.
   * Body:
   * {
   *   "Cultivo_id": 1,
   *   "Fecha": "2026-07-12",
   *   "Cantidad": 1500,
   *   "Unidad": "kg",
   *   "Observaciones": "Buena producción"
   * }
   * Headers: Authorization: Bearer <token>, Content-Type: application/json
   */
  @UseGuards(SupabaseAuthGuard)
  @Post()
  async create(
    @Req() req,
    @Body() datos: CreateCosechaDto,
  ): Promise<ResponseCosechaDto> {
    const usuario = await this.usuarioService.getOrCreateFromToken(req.user);
    return this.cosechaService.create(usuario.Usuario_id, datos);
  }

  /**
   * PATCH /cosechas/:id
   * Actualiza una cosecha específica.
   * Params:
   *  - id (obligatorio): ID de la cosecha
   * Body:
   * {
   *   "Fecha": "2026-07-15",
   *   "Cantidad": 1600,
   *   "Unidad": "kg",
   *   "Observaciones": "Ajuste por medición final"
   * }
   * Headers: Authorization: Bearer <token>, Content-Type: application/json
   */
  @UseGuards(SupabaseAuthGuard)
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() datos: UpdateCosechaDto,
  ): Promise<ResponseCosechaDto> {
    return this.cosechaService.update(id, datos);
  }

  /**
   * DELETE /cosechas/:id
   * Elimina una cosecha específica.
   * Params:
   *  - id (obligatorio): ID de la cosecha
   * Body: ninguno
   * Headers: Authorization: Bearer <token>
   */
  @UseGuards(SupabaseAuthGuard)
  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    return this.cosechaService.remove(id);
  }
}