export class ResponseAnimalDto {
  Animal_id: number;
  Nombre: string;
  Raza: string | null;
  Sexo: string;
  Color: string | null;
  Fecha_Nacimiento: Date | null;
  Peso: number | null;
  Peso_Unidad: string | null;
  Altura: number | null;
  Estado_Label: string | null;
  Notas: string | null;
  Estado: boolean;
  Foto: string | null;
  Registro: Date;
  Actualizado: Date;
  Categoria: string;
  Parcela: string | null;
}