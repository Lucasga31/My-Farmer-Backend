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
import { EventoAnimalService } from './evento_animal.service';
import { UsuarioService } from '../usuario/usuario.service';
import { CreateEventoAnimalDto } from './dto/create-evento_animal.dto';
import { UpdateEventoAnimalDto } from './dto/update-evento_animal.dto';
import { ResponseEventoAnimalDto } from './dto/response-evento-animal.dto';
import { SupabaseAuthGuard } from '../auth/supabase-auth/supabase-auth.guard';
import { File } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('eventos-animal')
export class EventoAnimalController {
  constructor(
    private readonly eventoAnimalService: EventoAnimalService,
    private readonly usuarioService: UsuarioService,
  ) { }

  /**
   * GET /eventos-animal/animal/:animalId?limit=
   * Retorna eventos de un animal del usuario autenticado.
   * Params:
   *  - animalId (obligatorio): ID del animal
   * Query:
   *  - limit (opcional)
   * Body: ninguno
   * Headers: Authorization: Bearer <token>
   */
  @UseGuards(SupabaseAuthGuard)
  @Get('animal/:animalId')
  async findByAnimal(
    @Req() req,
    @Param('animalId', ParseIntPipe) animalId: number,
    @Query('limit') limit?: number,
  ): Promise<ResponseEventoAnimalDto[]> {
    const usuario = await this.usuarioService.getOrCreateFromToken(req.user);
    return this.eventoAnimalService.findByAnimal(
      animalId,
      usuario.Usuario_id,
      limit,
    );
  }

  /**
   * GET /eventos-animal/:id
   * Obtiene un evento específico del usuario autenticado.
   * Params:
   *  - id (obligatorio): ID del evento
   * Body: ninguno
   * Headers: Authorization: Bearer <token>
   */
  @UseGuards(SupabaseAuthGuard)
  @Get(':id')
  async findOne(
    @Req() req,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ResponseEventoAnimalDto> {
    const usuario = await this.usuarioService.getOrCreateFromToken(req.user);
    return this.eventoAnimalService.findOne(id, usuario.Usuario_id);
  }

  /**
   * POST /eventos-animal
   * Crea un nuevo evento para un animal del usuario autenticado.
   * Body:
   * {
   *   "Animal_id": 1,
   *   "Titulo": "Vacunacion",       
   *   "Fecha": "2026-03-01",
   *   "Tipo": "vacuna",        vacuna, revision, tratamiento, alimentacion, otro
   *   "Descripcion": "Vacuna contra enfermedades",
   *   "Foto": archivo
   * }
   * Headers: Authorization: Bearer <token>, Content-Type: application/json
   */
  @UseGuards(SupabaseAuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('Foto'))
  async create(
    @Req() req,
    @Body() datos: CreateEventoAnimalDto,
    @UploadedFile() file?: File,
  ): Promise<ResponseEventoAnimalDto> {
    const usuario = await this.usuarioService.getOrCreateFromToken(req.user);
    return this.eventoAnimalService.create(usuario.Usuario_id, datos, file);
  }

  /**
   * PATCH /eventos-animal/:id
   * Actualiza un evento del usuario autenticado.
   * Params:
   *  - id (obligatorio): ID del evento
   * Body:
   * {
   *   "Titulo": "Vacunación anual",
   *   "Fecha": "2026-03-02",
   *   "Tipo": "vacuna",        vacuna, revision, tratamiento, alimentacion, otro
   *   "Descripcion": "Refuerzo aplicado",
   *   "Foto": archivo
   * }
   * Headers: Authorization: Bearer <token>, Content-Type: application/json
   */
  @UseGuards(SupabaseAuthGuard)
  @Patch(':id')
  @UseInterceptors(FileInterceptor('Foto'))
  async update(
    @Req() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() datos: UpdateEventoAnimalDto,
    @UploadedFile() file?: File,
  ): Promise<ResponseEventoAnimalDto> {
    const usuario = await this.usuarioService.getOrCreateFromToken(req.user);
    return this.eventoAnimalService.update(id, usuario.Usuario_id, datos, file);
  }

  /**
   * DELETE /eventos-animal/:id
   * Elimina un evento del usuario autenticado.
   * Params:
   *  - id (obligatorio): ID del evento
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
    return this.eventoAnimalService.remove(id, usuario.Usuario_id);
  }
}