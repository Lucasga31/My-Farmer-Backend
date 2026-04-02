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
  UseInterceptors,
  UploadedFile,
  BadRequestException
} from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { ResponseUsuarioDto } from './dto/response-usuario.dto';
import { SupabaseAuthGuard } from '../auth/supabase-auth/supabase-auth.guard';
import { File } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('usuarios')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) { }

  /**
   * 🟢 GET /usuarios/me
   * Headers: Authorization: Bearer <token_supabase>
   */
  @UseGuards(SupabaseAuthGuard)
  @Get('me')
  async getMe(@Req() req): Promise<ResponseUsuarioDto> {
    const supabaseId = req.user.userId;
    const email = req.user.email;

    let usuario = await this.usuarioService.findBySupabaseId(supabaseId);

    if (!usuario) {
      usuario = await this.usuarioService.createFromSupabase({
        email,
        userId: supabaseId,
        nombre: req.user.nombre,
        apellido: req.user.apellido,
      });
    }

    return usuario;
  }

  /**
   * 🟢 GET /usuarios
   * Headers: Authorization: Bearer <token_supabase>
   */
  @UseGuards(SupabaseAuthGuard)
  @Get()
  findAll(): Promise<ResponseUsuarioDto[]> {
    return this.usuarioService.findAll();
  }

  /**
   * 🟢 GET /usuarios/:id
   * Headers: Authorization: Bearer <token_supabase>
   */
  @UseGuards(SupabaseAuthGuard)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<ResponseUsuarioDto> {
    return this.usuarioService.findOne(id);
  }

  /**
   * 🔵 POST /usuarios
   * Body: { "Nombre": "Juan", "Apellido": "Perez", "Correo": "juan@example.com", "Contrasena": "123456" }
   */
  @Post()
  create(@Body() datos: CreateUsuarioDto): Promise<ResponseUsuarioDto> {
    return this.usuarioService.create(datos);
  }

  /**
   * � POST /usuarios/solicitar-recuperacion
   * Body: { "email": "juan@example.com" }
   */
  @Post('solicitar-recuperacion')
  solicitarRecuperacion(@Body() body: { email: string }) {
    return this.usuarioService.solicitarRecuperacion(body.email);
  }

  /**
   * � POST /usuarios/confirmar-recuperacion
   * Body: { "email": "juan@example.com", "codigo": "123456", "nuevaContrasena": "nueva123" }
   */
  @Post('confirmar-recuperacion')
  confirmarRecuperacion(
    @Body()
    body: { email: string; codigo: string; nuevaContrasena: string },
  ) {
    return this.usuarioService.confirmarRecuperacion(
      body.email,
      body.codigo,
      body.nuevaContrasena,
    );
  }

  /**
   * 🟠 PATCH /usuarios/cambiar-contrasena
   * Headers: Authorization: Bearer <token_supabase>
   * Body: { "contrasenaNueva": "nueva123" }
   */
  @UseGuards(SupabaseAuthGuard)
  @Patch('cambiar-contrasena')
  async cambiarContrasena(
    @Req() req: any,
    @Body() body: { contrasenaNueva: string },
  ): Promise<void> {
    const userId = req.user.userId; // UUID de Supabase
    if (!userId) throw new BadRequestException('Usuario no autenticado');

    const usuario = await this.usuarioService.getOrCreateFromToken(req.user);
    
    if (!usuario.supabaseId) throw new BadRequestException('Usuario sin supabaseId');

    return this.usuarioService.cambiarContrasena(usuario.supabaseId, body.contrasenaNueva);
  }

  /**
   * 🟠 PATCH /usuarios/restablecer-contrasena
   * Body: { "email": "juan@example.com", "redirectTo": "http://localhost:3000/reset" }
   */
  @Patch('restablecer-contrasena')
  async restablecerContrasena(
    @Body() body: { email: string; redirectTo?: string },
  ): Promise<void> {
    return this.usuarioService.restablecerContrasena(body.email, body.redirectTo);
  }

  /**
   * 🟠 PATCH /usuarios/:id
   * Headers: Authorization: Bearer <token_supabase>
   * Body: { "Nombre": "Juan Editado" }
   */
  @UseGuards(SupabaseAuthGuard)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() datos: UpdateUsuarioDto,
  ): Promise<ResponseUsuarioDto> {
    return this.usuarioService.update(id, datos);
  }

  /**
   * 🟠 PATCH /usuarios/:id/premium
   * Headers: Authorization: Bearer <token_supabase>
   * Body: { "premium": true, "expira": "2026-12-31T23:59:59Z" }
   */
  @UseGuards(SupabaseAuthGuard)
  @Patch(':id/premium')
  actualizarPremium(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { premium: boolean; expira: string | null },
  ): Promise<void> {
    const expira = body.expira ? new Date(body.expira) : null;
    return this.usuarioService.actualizarPremium(id, body.premium, expira);
  }

  /**
   * 🔴 DELETE /usuarios/:id
   * Headers: Authorization: Bearer <token_supabase>
   */
  @UseGuards(SupabaseAuthGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.usuarioService.remove(id);
  }
}