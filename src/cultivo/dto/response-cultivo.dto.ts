export class ResponseCultivoDto {
  Cultivo_id: number;
  Nombre: string;
  Estado: string;
  Fecha_Siembra: Date | null;
  Fecha_Cosecha_Estimada: Date | null;
  Fecha_Cosecha: Date | null;
  Rendimiento_Estimado: number | null;
  Rendimiento_Unidad: string | null;
  Notas: string | null;
  Foto: string | null;
  Activo: boolean;
  Registro: Date;
  Actualizado: Date;
  Tipo_Cultivo: string | null;
  Parcela: string | null;
}