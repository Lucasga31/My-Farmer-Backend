import { TipoEvento } from '../entities/evento_animal.entity';

export class CreateEventoAnimalDto {
  Animal_id: number;
  Titulo: string;
  Fecha: Date;
  Tipo: TipoEvento;
  Descripcion?: string | null;
  Foto?: string | null;
}
