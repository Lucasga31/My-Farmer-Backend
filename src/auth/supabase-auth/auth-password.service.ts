import { Injectable, BadRequestException } from '@nestjs/common';
import { SupabaseService } from '../supabase-storage/supabase.service';

@Injectable()
export class SupabaseAuthService {
  constructor(private readonly supabaseService: SupabaseService) {}

  /**
   * Cambia la contraseña de un usuario en Supabase
   * Solo usando supabaseId y Service Role
   */
  async cambiarContrasena(supabaseId: string, contrasenaNueva: string): Promise<void> {
    if (!supabaseId) throw new BadRequestException('supabaseId requerido');

    const { error } = await this.supabaseService.client.auth.admin.updateUserById(
      supabaseId,
      { password: contrasenaNueva },
    );

    if (error) throw new BadRequestException(error.message);
  }

  /**
   * Restablece la contraseña de un usuario mediante email
   * Esto envía el correo de reset a Supabase
   */
  async restablecerContrasena(email: string, redirectTo?: string): Promise<void> {
    if (!email) throw new BadRequestException('Email requerido');

    const { error } = await this.supabaseService.client.auth.resetPasswordForEmail(email, {
      redirectTo,
    });

    if (error) throw new BadRequestException(error.message);
  }
}