export class UpdateUsuarioDto {
  Nombre?: string;
  Apellido?: string;
  Foto?: string | null;
  Estado?: boolean;
  Premium?: boolean;
  Expira?: Date | null;
  Auth_Provider?: string | null;
}