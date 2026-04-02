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
import { Parcela } from 'src/parcela/entities/parcela.entity';
import { TipoCultivo } from 'src/tipo_cultivo/entities/tipo_cultivo.entity';
import { HistorialCultivo } from 'src/historial_cultivo/entities/historial_cultivo.entity';
import { Crecimiento } from 'src/crecimiento/entities/crecimiento.entity';
import { Cosecha } from 'src/cosecha/entities/cosecha.entity';

export enum EstadoCultivo {
  EN_CRECIMIENTO = 'en_crecimiento',
  COSECHADO = 'cosechado',
}

@Entity('cultivo')
export class Cultivo {

  @PrimaryGeneratedColumn()
  Cultivo_id: number;

  @Column({ type: 'int' })
  Usuario_id: number;

  @Column({ type: 'int', nullable: true })
  Parcela_id: number | null;

  @Column({ type: 'int', nullable: true })
  Tipo_Cultivo_id: number | null;

  @Column({ type: 'varchar', length: 100 })
  Nombre: string;

  @Column({ type: 'enum', enum: EstadoCultivo })
  Estado: EstadoCultivo;

  @Column({ type: 'date', nullable: true })
  Fecha_Siembra: Date | null;

  @Column({ type: 'date', nullable: true })
  Fecha_Cosecha_Estimada: Date | null;

  @Column({ type: 'date', nullable: true })
  Fecha_Cosecha: Date | null;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  Rendimiento_Estimado: number | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  Rendimiento_Unidad: string | null;

  @Column({ type: 'text', nullable: true })
  Notas: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  Foto: string | null;

  @Column({ type: 'boolean', default: true })
  Activo: boolean;

  @Column({ type: 'boolean', default: false })
  Eliminado: boolean;

  @CreateDateColumn()
  Registro: Date;

  @UpdateDateColumn()
  Actualizado: Date;

  @ManyToOne(() => Usuario, usuario => usuario.Cultivos)
  @JoinColumn({ name: 'Usuario_id' })
  Usuario: Usuario;

  @ManyToOne(() => Parcela, parcela => parcela.Cultivos, { nullable: true })
  @JoinColumn({ name: 'Parcela_id' })
  Parcela: Parcela | null;

  @ManyToOne(() => TipoCultivo, tipo => tipo.Cultivos, { nullable: true })
  @JoinColumn({ name: 'Tipo_Cultivo_id' })
  TipoCultivo: TipoCultivo | null;

  @OneToMany(() => HistorialCultivo, historial => historial.Cultivo)
  Historial: HistorialCultivo[];

  @OneToMany(() => Crecimiento, crecimiento => crecimiento.Cultivo)
  Crecimientos: Crecimiento[];

  @OneToMany(() => Cosecha, cosecha => cosecha.Cultivo)
  Cosechas: Cosecha[];
}