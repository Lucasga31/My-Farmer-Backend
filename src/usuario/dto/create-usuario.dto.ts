export class CreateUsuarioDto {
  Nombre?: string;
  Apellido?: string;
  Correo: string;
  Contrasena?: string | null;
  Foto?: string | null;
  supabaseId?: string | null;
  Auth_Provider?: string | null;
}