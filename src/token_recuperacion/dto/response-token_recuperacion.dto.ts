export class ResponseTokenRecuperacionDto {
  id: number;
  Usuario_id: number;
  Expira: Date;
  Usado_En: Date | null;
  Registro: Date;
  Token: string;
}