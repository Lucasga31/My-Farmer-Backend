import { SexoAnimal } from '../entities/animal.entity';

export class UpdateAnimalDto {
  Nombre?: string;
  Raza?: string | null;
  Sexo?: SexoAnimal;
  Color?: string | null;
  Fecha_Nacimiento?: Date | null;
  Peso?: number | null;
  Peso_Unidad?: string | null;
  Altura?: number | null;
  Estado_Label?: string | null;
  Notas?: string | null;
  Estado?: boolean;
  Parcela_id?: number | null;
  Categoria_Animal_id?: number;
  Foto?: string | null;
}