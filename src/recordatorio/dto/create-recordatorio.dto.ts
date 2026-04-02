import { EntidadTipo } from 'src/recordatorio/entities/recordatorio.entity';

export class CreateRecordatorioDto {
  Entidad_Tipo: EntidadTipo;
  Entidad_id: number;
  Titulo: string;
  Descripcion?: string | null;
  Recordar: Date;
}
