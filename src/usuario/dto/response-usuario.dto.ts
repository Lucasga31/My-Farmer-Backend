// DTO para la respuesta de usuario (lo que se devuelve al cliente)
export class ResponseUsuarioDto {
  Usuario_id: number;
  Nombre?: string;
  Apellido?: string;
  Correo: string;
  Foto?: string | null;
  Auth_Provider?: string | null;
  Premium: boolean;
  Expira?: Date | null;
  Estado: boolean;
  Registro: Date;
  Actualizado: Date;
  supabaseId?: string | null; // incluir si quieres exponer el id de Supabase
}