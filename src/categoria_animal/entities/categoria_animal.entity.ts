import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Animal } from 'src/animal/entities/animal.entity';

@Entity('categoria_animal')
export class CategoriaAnimal {

  @PrimaryGeneratedColumn()
  Categoria_Animal_id: number;

  @Column({ type: 'varchar', length: 100 })
  Nombre: string;

  @Column({ type: 'text', nullable: true })
  Descripcion: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  Icono: string | null;

  @CreateDateColumn()
  Registro: Date;

  @OneToMany(() => Animal, animal => animal.CategoriaAnimal)
  Animales: Animal[];
}
