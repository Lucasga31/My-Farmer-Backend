import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Usuario } from 'src/usuario/entities/usuario.entity';

export enum PlanSuscripcion {
  GRATUITO = 'gratuito',
  PREMIUM = 'premium',
}

export enum CicloFacturacion {
  MENSUAL = 'mensual',
  ANUAL = 'anual',
}

export enum EstadoSuscripcion {
  ACTIVA = 'activa',
  VENCIDA = 'vencida',
  CANCELADA = 'cancelada',
}

@Entity('suscripcion')
export class Suscripcion {

  @PrimaryGeneratedColumn()
  Suscripcion_id: number;

  @Column({ type: 'int' })
  Usuario_id: number;

  @Column({ type: 'enum', enum: PlanSuscripcion })
  Plan: PlanSuscripcion;

  @Column({ type: 'enum', enum: CicloFacturacion })
  Facturacion: CicloFacturacion;

  @Column({ type: 'timestamp' })
  Inicio: Date;

  @Column({ type: 'timestamp', nullable: true })
  Fin: Date | null;

  @Column({ type: 'enum', enum: EstadoSuscripcion })
  Estado: EstadoSuscripcion;

  @ManyToOne(() => Usuario, usuario => usuario.Suscripciones)
  @JoinColumn({ name: 'Usuario_id' })
  Usuario: Usuario;
}
