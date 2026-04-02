import { EstadoCultivo } from '../entities/cultivo.entity';

export class CreateCultivoDto {
  Nombre: string;
  Estado: EstadoCultivo;
  Fecha_Siembra?: Date | null;
  Fecha_Cosecha_Estimada?: Date | null;
  Fecha_Cosecha?: Date | null;
  Rendimiento_Estimado?: number | null;
  Rendimiento_Unidad?: string | null;
  Notas?: string | null;
  Foto?: string | null;
  Parcela_id?: number | null;
  Tipo_Cultivo_id?: number | null;
}