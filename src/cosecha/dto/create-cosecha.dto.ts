export class CreateCosechaDto {
  Cultivo_id: number;
  Fecha: Date;
  Cantidad: number;
  Unidad: string;
  Observaciones?: string | null;
}
