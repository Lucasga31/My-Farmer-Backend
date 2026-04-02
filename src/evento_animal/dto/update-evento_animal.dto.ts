import { TipoEvento } from '../entities/evento_animal.entity';

export class UpdateEventoAnimalDto {
  Titulo?: string;
  Fecha?: Date;
  Tipo?: TipoEvento;
  Descripcion?: string | null;
  Foto?: string | null;
}
