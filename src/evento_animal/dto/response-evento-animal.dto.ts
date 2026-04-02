export class ResponseEventoAnimalDto {
  Evento_id: number;
  Animal_id: number;
  Titulo: string;
  Descripcion: string | null;
  Fecha: Date;
  Tipo: string;
  Foto: string | null;
  Registro: Date;
}