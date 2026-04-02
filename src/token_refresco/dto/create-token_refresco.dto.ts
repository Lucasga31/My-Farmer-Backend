export class CreateTokenRefrescoDto {
  Usuario_id: number;
  Token_Hash: string;
  Expira: Date;
  Revocado?: boolean;
}
