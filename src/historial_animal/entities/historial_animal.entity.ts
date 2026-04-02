import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Animal } from 'src/animal/entities/animal.entity';

@Entity('historial_animal')
export class HistorialAnimal {

  @PrimaryGeneratedColumn()
  Historial_Animal_id: number;

  @Column({ type: 'int' })
  Animal_id: number;

  @Column({ type: 'varchar', length: 100 })
  Campo_Mod: string;

  @Column({ type: 'text' })
  Valor_Ant: string;

  @Column({ type: 'text' })
  Valor_Nue: string;

  @CreateDateColumn()
  Fecha: Date;

  @ManyToOne(() => Animal, animal => animal.Historial)
  @JoinColumn({ name: 'Animal_id' })
  Animal: Animal;
}
