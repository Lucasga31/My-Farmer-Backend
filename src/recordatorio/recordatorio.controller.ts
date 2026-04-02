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
import { RecordatorioService } from './recordatorio.service';
import { UsuarioService } from '../usuario/usuario.service';
import { CreateRecordatorioDto } from './dto/create-recordatorio.dto';
import { UpdateRecordatorioDto } from './dto/update-recordatorio.dto';
import { ResponseRecordatorioDto } from './dto/response-recordatorio.dto';
import { SupabaseAuthGuard } from '../auth/supabase-auth/supabase-auth.guard';
import { EntidadTipo } from './entities/recordatorio.entity';

@Controller('recordatorios')
export class RecordatorioController {
  constructor(
    private readonly recordatorioService: RecordatorioService,
    private readonly usuarioService: UsuarioService,
  ) { }

  /**
   * 🟢 GET /recordatorios
   * Headers: Authorization: Bearer <token_supabase>
   */
  @UseGuards(SupabaseAuthGuard)
  @Get()
  async findByUsuario(@Req() req): Promise<ResponseRecordatorioDto[]> {
    const usuario = await this.usuarioService.getOrCreateFromToken(req.user);
    return this.recordatorioService.findByUsuario(usuario.Usuario_id);
  }

  /**
   * 🟢 GET /recordatorios/:id
   * Headers: Authorization: Bearer <token_supabase>
   */
  @UseGuards(SupabaseAuthGuard)
  @Get(':id')
  async findOne(@Req() req, @Param('id', ParseIntPipe) id: number): Promise<ResponseRecordatorioDto> {
    const usuario = await this.usuarioService.getOrCreateFromToken(req.user);
    return this.recordatorioService.findOne(id, usuario.Usuario_id);
  }

  /**
   * 🔵 POST /recordatorios
   * Headers: Authorization: Bearer <token_supabase>
   * Body: { "Entidad_Tipo": "Cultivo", "Entidad_id": 1, "Titulo": "Riego", "Recordar": "2026-03-31T10:00:00Z" }
   */
  @UseGuards(SupabaseAuthGuard)
  @Post()
  async create(@Req() req, @Body() datos: CreateRecordatorioDto): Promise<ResponseRecordatorioDto> {
    const usuario = await this.usuarioService.getOrCreateFromToken(req.user);
    return this.recordatorioService.create(usuario.Usuario_id, datos);
  }

  /**
   * 🟠 PATCH /recordatorios/:id
   * Headers: Authorization: Bearer <token_supabase>
   * Body: { "Titulo": "Riego Editado" }
   */
  @UseGuards(SupabaseAuthGuard)
  @Patch(':id')
  async update(@Req() req, @Param('id', ParseIntPipe) id: number, @Body() datos: UpdateRecordatorioDto): Promise<ResponseRecordatorioDto> {
    const usuario = await this.usuarioService.getOrCreateFromToken(req.user);
    return this.recordatorioService.update(id, usuario.Usuario_id, datos);
  }

  /**
   * 🔴 DELETE /recordatorios/:id
   * Headers: Authorization: Bearer <token_supabase>
   */
  @UseGuards(SupabaseAuthGuard)
  @Delete(':id')
  async remove(@Req() req, @Param('id', ParseIntPipe) id: number): Promise<void> {
    const usuario = await this.usuarioService.getOrCreateFromToken(req.user);
    return this.recordatorioService.remove(id, usuario.Usuario_id);
  }


  /**
   * PATCH /recordatorios/entidad/:tipo/:entidadId/cancelar
   * Cancela recordatorios por entidad (global)
   * Params:
   *  - tipo: tipo de entidad
   *  - entidadId: ID de la entidad
   * Headers: Authorization: Bearer <token>
   * Requiere UsuarioService: no
   */
  @UseGuards(SupabaseAuthGuard)
  @Patch('entidad/:tipo/:entidadId/cancelar')
  async cancelarPorEntidad(@Param('tipo') tipo: EntidadTipo, @Param('entidadId', ParseIntPipe) entidadId: number): Promise<void> {
    return this.recordatorioService.cancelarPorEntidad(tipo, entidadId);
  }
}