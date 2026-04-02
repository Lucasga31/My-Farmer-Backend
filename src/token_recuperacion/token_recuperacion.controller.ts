import {
  Controller,
  Post,
  Patch,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { TokenRecuperacionService } from './token_recuperacion.service';
import { ResponseTokenRecuperacionDto } from './dto/response-token_recuperacion.dto';

@Controller('tokens-recuperacion')
export class TokenRecuperacionController {

  constructor(private readonly tokenRecuperacionService: TokenRecuperacionService) {}

  // // ← genera PIN automáticamente, no necesita body
  // @Post('usuario/:usuarioId')
  // create(
  //   @Param('usuarioId', ParseIntPipe) usuarioId: number,
  // ): Promise<ResponseTokenRecuperacionDto> {
  //   return this.tokenRecuperacionService.create(usuarioId);
  // }

  // // ← valida el PIN ingresado por el usuario
  // @Post('usuario/:usuarioId/validar')
  // validarPin(
  //   @Param('usuarioId', ParseIntPipe) usuarioId: number,
  //   @Body() body: { pin: string },
  // ): Promise<boolean> {
  //   return this.tokenRecuperacionService.validarPin(body.pin, usuarioId);
  // }

  // // ← marca el PIN como usado tras restablecer la contraseña
  // @Patch('usuario/:usuarioId/usar')
  // marcarComoUsado(
  //   @Param('usuarioId', ParseIntPipe) usuarioId: number,
  //   @Body() body: { pin: string },
  // ): Promise<void> {
  //   return this.tokenRecuperacionService.marcarComoUsado(body.pin, usuarioId);
  // }
}