import { SexoAnimal } from '../entities/animal.entity';

export class CreateAnimalDto {
  Nombre: string;
  Sexo: SexoAnimal;
  Categoria_Animal_id: number;
  Raza?: string | null;
  Color?: string | null;
  Fecha_Nacimiento?: Date | null;
  Peso?: number | null;
  Peso_Unidad?: string | null;
  Altura?: number | null;
  Estado_Label?: string | null;
  Notas?: string | null;
  Foto?: string | null;
  Parcela_id?: number | null;
}