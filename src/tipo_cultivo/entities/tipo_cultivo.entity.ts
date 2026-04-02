import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Cultivo } from 'src/cultivo/entities/cultivo.entity';

@Entity('tipo_cultivo')
export class TipoCultivo {

  @PrimaryGeneratedColumn()
  Tipo_Cultivo_id: number;

  @Column({ type: 'varchar', length: 100 })
  Nombre: string;

  @Column({ type: 'text', nullable: true })
  Descripcion: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  Icono: string | null;

  @CreateDateColumn()
  Registro: Date;

  @OneToMany(() => Cultivo, cultivo => cultivo.TipoCultivo)
  Cultivos: Cultivo[];
}
