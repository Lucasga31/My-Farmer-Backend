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
} from '@nestjs/common';
import { ParcelaService } from './parcela.service';
import { UsuarioService } from '../usuario/usuario.service';
import { CreateParcelaDto } from './dto/create-parcela.dto';
import { UpdateParcelaDto } from './dto/update-parcela.dto';
import { ResponseParcelaDto } from './dto/response-parcela.dto';
import { SupabaseAuthGuard } from '../auth/supabase-auth/supabase-auth.guard';

@Controller('parcelas')
export class ParcelaController {
  constructor(
    private readonly parcelaService: ParcelaService,
    private readonly usuarioService: UsuarioService,
  ) {}

  /**
   * GET /parcelas
   * Retorna todas las parcelas del usuario autenticado.
   * Params: ninguno
   * Body: ninguno
   * Headers: Authorization: Bearer <token>
   * Requiere UsuarioService: sí
   */
  @UseGuards(SupabaseAuthGuard)
  @Get()
  async findAll(@Req() req): Promise<ResponseParcelaDto[]> {
    const usuario = await this.usuarioService.getOrCreateFromToken(req.user);
    return this.parcelaService.findAll(usuario.Usuario_id);
  }

  /**
   * GET /parcelas/:id
   * Obtiene una parcela específica del usuario autenticado.
   * Params:
   *  - id (obligatorio): ID de la parcela
   * Body: ninguno
   * Headers: Authorization: Bearer <token>
   * Requiere UsuarioService: sí
   */
  @UseGuards(SupabaseAuthGuard)
  @Get(':id')
  async findOne(
    @Req() req,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ResponseParcelaDto> {
    const usuario = await this.usuarioService.getOrCreateFromToken(req.user);
    return this.parcelaService.findOne(id, usuario.Usuario_id);
  }

  /**
   * POST /parcelas
   * Crea una nueva parcela para el usuario autenticado.
   * Body (JSON) ejemplo para Postman:
   * {
   *   "Nombre": "Lote 3",
   *   "Area": 2.75,
   *   "Descripcion": "Lote para cultivos de maíz",
   *   "Latitud": 9.9281234,
   *   "Longitud": -84.0907123,
   *   "Poligono": [
   *     { "lat": 9.9281, "lng": -84.0907 },
   *     { "lat": 9.9285, "lng": -84.0901 },
   *     { "lat": 9.9279, "lng": -84.0898 },
   *     { "lat": 9.9281, "lng": -84.0907 }
   *   ]
   * }
   * Headers: Authorization: Bearer <token>, Content-Type: application/json
   * Requiere UsuarioService: sí
   */
  @UseGuards(SupabaseAuthGuard)
  @Post()
  async create(
    @Req() req,
    @Body() datos: CreateParcelaDto,
  ): Promise<ResponseParcelaDto> {
    const usuario = await this.usuarioService.getOrCreateFromToken(req.user);
    return this.parcelaService.create(usuario.Usuario_id, datos);
  }

  /**
   * PATCH /parcelas/:id
   * Actualiza una parcela del usuario autenticado.
   * Params:
   *  - id (obligatorio): ID de la parcela
   * Body (JSON) ejemplo para Postman:
   * {
   *   "Nombre": "Lote 3 Actualizado",
   *   "Area": 3.1,
   *   "Descripcion": "Área ampliada",
   *   "Latitud": 9.9285,
   *   "Longitud": -84.0905,
   *   "Poligono": [
   *     { "lat": 9.9282, "lng": -84.0908 },
   *     { "lat": 9.9286, "lng": -84.0902 },
   *     { "lat": 9.9280, "lng": -84.0899 },
   *     { "lat": 9.9282, "lng": -84.0908 }
   *   ],
   *   "Activo": true
   * }
   * Headers: Authorization: Bearer <token>, Content-Type: application/json
   * Requiere UsuarioService: sí
   */
  @UseGuards(SupabaseAuthGuard)
  @Patch(':id')
  async update(
    @Req() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() datos: UpdateParcelaDto,
  ): Promise<ResponseParcelaDto> {
    const usuario = await this.usuarioService.getOrCreateFromToken(req.user);
    return this.parcelaService.update(id, usuario.Usuario_id, datos);
  }

  /**
   * DELETE /parcelas/:id
   * Elimina una parcela del usuario autenticado.
   * Params:
   *  - id (obligatorio): ID de la parcela
   * Body: ninguno
   * Headers: Authorization: Bearer <token>
   * Requiere UsuarioService: sí
   */
  @UseGuards(SupabaseAuthGuard)
  @Delete(':id')
  async remove(
    @Req() req,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    const usuario = await this.usuarioService.getOrCreateFromToken(req.user);
    return this.parcelaService.remove(id, usuario.Usuario_id);
  }
}