import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Cultivo } from 'src/cultivo/entities/cultivo.entity';

@Entity('crecimiento')
export class Crecimiento {

  @PrimaryGeneratedColumn()
  Crecimiento_id: number;

  @Column({ type: 'int' })
  Cultivo_id: number;

  @Column({ type: 'decimal', precision: 8, scale: 2, nullable: true })
  Altura: number | null;

  @Column({ type: 'text', nullable: true })
  Observaciones: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  Foto: string | null;

  @CreateDateColumn()
  Registro: Date;

  @ManyToOne(() => Cultivo, cultivo => cultivo.Crecimientos)
  @JoinColumn({ name: 'Cultivo_id' })
  Cultivo: Cultivo;
}
