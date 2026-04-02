import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Cultivo } from 'src/cultivo/entities/cultivo.entity';

@Entity('cosecha')
export class Cosecha {

  @PrimaryGeneratedColumn()
  Cosecha_id: number;

  @Column({ type: 'int' })
  Cultivo_id: number;

  @Column({ type: 'date' })
  Fecha: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  Cantidad: number;

  @Column({ type: 'varchar', length: 50 })
  Unidad: string;

  @Column({ type: 'text', nullable: true })
  Observaciones: string | null;

  @CreateDateColumn()
  Registro: Date;

  @ManyToOne(() => Cultivo, cultivo => cultivo.Cosechas)
  @JoinColumn({ name: 'Cultivo_id' })
  Cultivo: Cultivo;
}
