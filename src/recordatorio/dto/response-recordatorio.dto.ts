export class ResponseRecordatorioDto {
  Recordatorio_id: number;
  Usuario_id: number;
  Entidad_Tipo: string;
  Entidad_id: number;
  Titulo: string;
  Descripcion: string | null;
  Recordar: Date;
  Enviado: boolean;
  Cancelado: boolean;
  Cancelado_En: Date | null;
  Registro: Date;
}