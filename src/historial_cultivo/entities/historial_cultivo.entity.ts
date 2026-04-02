import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Cultivo } from 'src/cultivo/entities/cultivo.entity';

@Entity('historial_cultivo')
export class HistorialCultivo {

  @PrimaryGeneratedColumn()
  Historial_Cultivo_id: number;

  @Column({ type: 'int' })
  Cultivo_id: number;

  @Column({ type: 'varchar', length: 100 })
  Campo_Mod: string;

  @Column({ type: 'text' })
  Valor_Ant: string;

  @Column({ type: 'text' })
  Valor_Nue: string;

  @CreateDateColumn()
  Fecha: Date;

  @ManyToOne(() => Cultivo, cultivo => cultivo.Historial)
  @JoinColumn({ name: 'Cultivo_id' })
  Cultivo: Cultivo;
}
