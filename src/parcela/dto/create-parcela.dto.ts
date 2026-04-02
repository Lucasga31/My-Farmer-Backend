export class CreateParcelaDto {
  Nombre: string;
  Area?: number | null;
  Descripcion?: string | null;
  Latitud?: number | null;
  Longitud?: number | null;
  Poligono?: object | null;
}
