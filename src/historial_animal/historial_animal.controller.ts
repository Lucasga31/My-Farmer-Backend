import { Controller, Get, Param, Query, ParseIntPipe, UseGuards, Req } from '@nestjs/common';
import { HistorialAnimalService } from './historial_animal.service';
import { HistorialAnimalDto } from './dto/historial-animal.dto';
import { ResponseHistorialAnimalDto } from './dto/response-historial_animal.dto';
import { SupabaseAuthGuard } from '../auth/supabase-auth/supabase-auth.guard';
import { UsuarioService } from '../usuario/usuario.service';

@Controller('historial-animal')
export class HistorialAnimalController {

  constructor(
    private readonly historialAnimalService: HistorialAnimalService,
    private readonly usuarioService: UsuarioService,
  ) {}

  /**
   * GET /historial-animal/animal/:animalId?limit=
   * Retorna el historial de un animal específico.
   * Query Parameters:
   *  - limit (opcional): número máximo de registros a retornar
   * Params:
   *  - animalId (obligatorio): ID del animal
   * Body: ninguno
   * Headers: Authorization: Bearer <token>
   */
  @UseGuards(SupabaseAuthGuard)
  @Get('animal/:animalId')
  async findByAnimal(
    @Req() req,
    @Param('animalId', ParseIntPipe) animalId: number,
    @Query() query: HistorialAnimalDto,
  ): Promise<ResponseHistorialAnimalDto[]> {
    const usuario = await this.usuarioService.getOrCreateFromToken(req.user);
    return this.historialAnimalService.findByAnimal(animalId, usuario.Usuario_id, query);
  }
}