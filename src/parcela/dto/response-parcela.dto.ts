export class ResponseParcelaDto {
  Parcela_id: number;
  Nombre: string;
  Area: number | null;
  Descripcion: string | null;
  Latitud: number | null;
  Longitud: number | null;
  Poligono: object | null;
  Activa: boolean;
  Registro: Date;
  Actualizado: Date;
}