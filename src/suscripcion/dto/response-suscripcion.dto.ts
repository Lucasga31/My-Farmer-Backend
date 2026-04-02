export class ResponseSuscripcionDto {
  Suscripcion_id: number;
  Usuario_id: number;
  Plan: string;
  Facturacion: string;
  Inicio: Date;
  Fin: Date | null;
  Estado: string;
}