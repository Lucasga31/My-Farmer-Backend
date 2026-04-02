// DTO para crear un usuario manualmente (si quieres permitirlo)
export class CreateUsuarioDto {
  Nombre?: string;
  Apellido?: string;
  Correo: string;
  Contrasena?: string | null;  // opcional si solo se usa Supabase
  Foto?: string | null;
  supabaseId?: string | null;  // corresponde al userId de Supabase
  Auth_Provider?: string | null;
}