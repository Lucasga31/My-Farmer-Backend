import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Usuario } from 'src/usuario/entities/usuario.entity';

export enum EntidadTipo {
  ANIMAL = 'animal',
  CULTIVO = 'cultivo',
}

@Entity('recordatorio')
export class Recordatorio {

  @PrimaryGeneratedColumn()
  Recordatorio_id: number;

  @Column({ type: 'int' })
  Usuario_id: number;

  @Column({ type: 'enum', enum: EntidadTipo })
  Entidad_Tipo: EntidadTipo;

  @Column({ type: 'int' })
  Entidad_id: number;

  @Column({ type: 'varchar', length: 150 })
  Titulo: string;

  @Column({ type: 'text', nullable: true })
  Descripcion: string | null;

  @Column({ type: 'timestamp' })
  Recordar: Date;

  @Column({ type: 'boolean', default: false })
  Enviado: boolean;

  @Column({ type: 'int', default: 0 })
  Intentos: number;

  @Column({ type: 'timestamp', nullable: true })
  Ultimo_Intento: Date | null;

  @Column({ type: 'boolean', default: false })
  Cancelado: boolean;

  @Column({ type: 'timestamp', nullable: true })
  Cancelado_En: Date | null;

  @CreateDateColumn()
  Registro: Date;

  @ManyToOne(() => Usuario, usuario => usuario.Recordatorios)
  @JoinColumn({ name: 'Usuario_id' })
  Usuario: Usuario;
}
