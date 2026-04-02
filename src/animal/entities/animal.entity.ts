import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Usuario } from 'src/usuario/entities/usuario.entity';
import { CategoriaAnimal } from 'src/categoria_animal/entities/categoria_animal.entity';
import { Parcela } from 'src/parcela/entities/parcela.entity';
import { HistorialAnimal } from 'src/historial_animal/entities/historial_animal.entity';
import { EventoAnimal } from 'src/evento_animal/entities/evento_animal.entity';

export enum SexoAnimal {
  MACHO = 'macho',
  HEMBRA = 'hembra',
}

@Entity('animal')
export class Animal {

  @PrimaryGeneratedColumn()
  Animal_id: number;

  @Column({ type: 'int' })
  Usuario_id: number;

  @Column({ type: 'int' })
  Categoria_Animal_id: number;

  @Column({ type: 'int', nullable: true })
  Parcela_id: number | null;

  @Column({ type: 'varchar', length: 100 })
  Nombre: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  Raza: string | null;

  @Column({ type: 'enum', enum: SexoAnimal })
  Sexo: SexoAnimal;

  @Column({ type: 'varchar', length: 50, nullable: true })
  Color: string | null;

  @Column({ type: 'date', nullable: true })
  Fecha_Nacimiento: Date | null;

  @Column({ type: 'decimal', precision: 8, scale: 2, nullable: true })
  Peso: number | null;

  @Column({ type: 'varchar', length: 10, nullable: true, default: 'kg' })
  Peso_Unidad: string | null;

  @Column({ type: 'decimal', precision: 8, scale: 2, nullable: true })
  Altura: number | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  Estado_Label: string | null;

  @Column({ type: 'text', nullable: true })
  Notas: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  Foto: string | null;

  @Column({ type: 'boolean', default: true })
  Estado: boolean;

  @Column({ type: 'boolean', default: false })
  Eliminado: boolean;

  @CreateDateColumn()
  Registro: Date;

  @UpdateDateColumn()
  Actualizado: Date;

  @ManyToOne(() => Usuario, usuario => usuario.Animales)
  @JoinColumn({ name: 'Usuario_id' })
  Usuario: Usuario;

  @ManyToOne(() => CategoriaAnimal, categoria => categoria.Animales)
  @JoinColumn({ name: 'Categoria_Animal_id' })
  CategoriaAnimal: CategoriaAnimal;

  @ManyToOne(() => Parcela, parcela => parcela.Animales, { nullable: true })
  @JoinColumn({ name: 'Parcela_id' })
  Parcela: Parcela | null;

  @OneToMany(() => HistorialAnimal, historial => historial.Animal)
  Historial: HistorialAnimal[];

  @OneToMany(() => EventoAnimal, evento => evento.Animal)
  Eventos: EventoAnimal[];
}