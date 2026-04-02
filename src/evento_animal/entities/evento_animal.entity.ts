import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Animal } from 'src/animal/entities/animal.entity';
import { Usuario } from 'src/usuario/entities/usuario.entity';

export enum TipoEvento {
  VACUNA = 'vacuna',
  REVISION = 'revision',
  TRATAMIENTO = 'tratamiento',
  ALIMENTACION = 'alimentacion',
  OTRO = 'otro',
}

@Entity('evento_animal')
export class EventoAnimal {

  @PrimaryGeneratedColumn()
  Evento_id: number;

  @Column({ type: 'int' })
  Animal_id: number;

  @Column({ type: 'int' })
  Usuario_id: number;

  @Column({ type: 'varchar', length: 150 })
  Titulo: string;

  @Column({ type: 'text', nullable: true })
  Descripcion: string | null;

  @Column({ type: 'date' })
  Fecha: Date;

  @Column({ type: 'enum', enum: TipoEvento })
  Tipo: TipoEvento;

  @Column({ type: 'varchar', length: 255, nullable: true })
  Foto: string | null;

  @Column({ type: 'boolean', default: false })
  Eliminado: boolean;

  @CreateDateColumn()
  Registro: Date;

  @ManyToOne(() => Animal, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'Animal_id' })
  Animal: Animal;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'Usuario_id' })
  Usuario: Usuario;
}