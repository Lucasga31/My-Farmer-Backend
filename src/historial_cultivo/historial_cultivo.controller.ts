import { Controller, Get, Param, Query, ParseIntPipe, UseGuards, Req } from '@nestjs/common';
import { HistorialCultivoService } from './historial_cultivo.service';
import { HistorialCultivoDto } from './dto/historial-cultivo.dto';
import { ResponseHistorialCultivoDto } from './dto/response-historial_cultivo.dto';
import { SupabaseAuthGuard } from '../auth/supabase-auth/supabase-auth.guard';
import { UsuarioService } from '../usuario/usuario.service';

@Controller('historial-cultivo')
export class HistorialCultivoController {

  constructor(
    private readonly historialCultivoService: HistorialCultivoService,
    private readonly usuarioService: UsuarioService,
  ) {}

  /**
   * GET /historial-cultivo/cultivo/:cultivoId?limit=
   * Retorna el historial de un cultivo específico.
   * Query Parameters:
   *  - limit (opcional): número máximo de registros a retornar
   * Params:
   *  - cultivoId (obligatorio): ID del cultivo
   * Body: ninguno
   * Headers: Authorization: Bearer <token>
   */
  @UseGuards(SupabaseAuthGuard)
  @Get('cultivo/:cultivoId')
  async findByCultivo(
    @Req() req,
    @Param('cultivoId', ParseIntPipe) cultivoId: number,
    @Query() query: HistorialCultivoDto,
  ): Promise<ResponseHistorialCultivoDto[]> {
    const usuario = await this.usuarioService.getOrCreateFromToken(req.user);
    return this.historialCultivoService.findByCultivo(cultivoId, usuario.Usuario_id, query);
  }
}