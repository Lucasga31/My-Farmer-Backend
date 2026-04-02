export class ResponseCrecimientoDto {
  Crecimiento_id: number;
  Cultivo_id: number;
  Altura: number | null;
  Observaciones: string | null;
  Foto: string | null;
  Registro: Date;
}