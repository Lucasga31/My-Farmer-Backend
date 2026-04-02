import { PlanSuscripcion, CicloFacturacion, EstadoSuscripcion } from 'src/suscripcion/entities/suscripcion.entity';

export class CreateSuscripcionDto {
  Usuario_id: number;
  Plan: PlanSuscripcion;
  Facturacion: CicloFacturacion;
  Inicio: Date;
  Fin?: Date | null;
  Estado: EstadoSuscripcion;
}
