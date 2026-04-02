export class UpdateRecordatorioDto {
  Titulo?: string;
  Descripcion?: string | null;
  Recordar?: Date;
  Cancelado?: boolean;
  Cancelado_En?: Date | null;
}
