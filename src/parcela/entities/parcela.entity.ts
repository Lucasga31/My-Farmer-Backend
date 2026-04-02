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
import { Animal } from 'src/animal/entities/animal.entity';
import { Cultivo } from 'src/cultivo/entities/cultivo.entity';

@Entity('parcela')
export class Parcela {

  @PrimaryGeneratedColumn()
  Parcela_id: number;

  @Column({ type: 'int' })
  Usuario_id: number;

  @Column({ type: 'varchar', length: 100 })
  Nombre: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  Area: number | null;

  @Column({ type: 'text', nullable: true })
  Descripcion: string | null;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  Latitud: number | null;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  Longitud: number | null;

  @Column({ type: 'json', nullable: true })
  Poligono: object | null;

  @Column({ type: 'boolean', default: true })
  Activa: boolean;

  @CreateDateColumn()
  Registro: Date;

  @UpdateDateColumn()
  Actualizado: Date;

  @ManyToOne(() => Usuario, usuario => usuario.Parcelas)
  @JoinColumn({ name: 'Usuario_id' })
  Usuario: Usuario;

  @OneToMany(() => Animal, animal => animal.Parcela)
  Animales: Animal[];

  @OneToMany(() => Cultivo, cultivo => cultivo.Parcela)
  Cultivos: Cultivo[];
}
