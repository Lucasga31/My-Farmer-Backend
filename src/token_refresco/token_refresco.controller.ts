import { Controller, Get, Post, Patch, Param, Body, ParseIntPipe } from '@nestjs/common';
import { TokenRefrescoService } from './token_refresco.service';
import { CreateTokenRefrescoDto } from './dto/create-token_refresco.dto';
import { ResponseTokenRefrescoDto } from './dto/response-token_refresco.dto';

@Controller('tokens-refresco')
export class TokenRefrescoController {

  constructor(private readonly tokenRefrescoService: TokenRefrescoService) {}

  @Get('usuario/:usuarioId')
  findByUsuario(
    @Param('usuarioId', ParseIntPipe) usuarioId: number,
  ): Promise<ResponseTokenRefrescoDto[]> {
    return this.tokenRefrescoService.findByUsuario(usuarioId);
  }

  @Post()
  create(@Body() datos: CreateTokenRefrescoDto): Promise<ResponseTokenRefrescoDto> {
    return this.tokenRefrescoService.create(datos);
  }

  @Patch(':id/revocar')
  revocar(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.tokenRefrescoService.revocar(id);
  }

  @Patch('usuario/:usuarioId/revocar-todos')
  revocarTodos(
    @Param('usuarioId', ParseIntPipe) usuarioId: number,
  ): Promise<void> {
    return this.tokenRefrescoService.revocarTodosDeUsuario(usuarioId);
  }
}