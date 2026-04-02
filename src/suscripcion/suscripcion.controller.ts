import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  ParseIntPipe,
  Req,
  UseGuards,
} from '@nestjs/common';
import { SuscripcionService } from './suscripcion.service';
import { UsuarioService } from '../usuario/usuario.service';
import { CreateSuscripcionDto } from './dto/create-suscripcion.dto';
import { UpdateSuscripcionDto } from './dto/update-suscripcion.dto';
import { ResponseSuscripcionDto } from './dto/response-suscripcion.dto';
import { SupabaseAuthGuard } from '../auth/supabase-auth/supabase-auth.guard';

@Controller('suscripciones')
export class SuscripcionController {
  constructor(
    private readonly suscripcionService: SuscripcionService,
    private readonly usuarioService: UsuarioService,
  ) {}

  /**
   * 🟢 GET /suscripciones
   * Headers: Authorization: Bearer <token_supabase>
   */
  @UseGuards(SupabaseAuthGuard)
  @Get()
  async findByUsuario(@Req() req): Promise<ResponseSuscripcionDto[]> {
    const usuario = await this.usuarioService.getOrCreateFromToken(req.user);
    return this.suscripcionService.findByUsuario(usuario.Usuario_id);
  }

  /**
   * 🟢 GET /suscripciones/activa
   * Headers: Authorization: Bearer <token_supabase>
   */
  @UseGuards(SupabaseAuthGuard)
  @Get('activa')
  async findActiva(@Req() req): Promise<ResponseSuscripcionDto | null> {
    const usuario = await this.usuarioService.getOrCreateFromToken(req.user);
    return this.suscripcionService.findActiva(usuario.Usuario_id);
  }

  /**
   * 🔵 POST /suscripciones
   * Headers: Authorization: Bearer <token_supabase>
   * Body: { "Plan": "Básico", "Facturacion": "Mensual" }
   */
  @UseGuards(SupabaseAuthGuard)
  @Post()
  async create(@Req() req, @Body() datos: CreateSuscripcionDto): Promise<ResponseSuscripcionDto> {
    const usuario = await this.usuarioService.getOrCreateFromToken(req.user);
    return this.suscripcionService.create({
      ...datos,
      Usuario_id: usuario.Usuario_id,
    });
  }

  /**
   * 🟠 PATCH /suscripciones/:id
   * Headers: Authorization: Bearer <token_supabase>
   * Body: { "Estado": "Activa" }
   */
  @UseGuards(SupabaseAuthGuard)
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() datos: UpdateSuscripcionDto,
  ): Promise<ResponseSuscripcionDto> {
    return this.suscripcionService.update(id, datos);
  }

  /**
   * 🟠 PATCH /suscripciones/:id/vencer
   * Headers: Authorization: Bearer <token_supabase>
   */
  @UseGuards(SupabaseAuthGuard)
  @Patch(':id/vencer')
  async vencer(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.suscripcionService.vencer(id);
  }

  /**
   * PATCH /suscripciones/:id/cancelar
   * Cancela una suscripción.
   * Headers: Authorization: Bearer <token>
   * Requiere UsuarioService: no
   */
  @UseGuards(SupabaseAuthGuard)
  @Patch(':id/cancelar')
  async cancelar(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.suscripcionService.cancelar(id);
  }
}