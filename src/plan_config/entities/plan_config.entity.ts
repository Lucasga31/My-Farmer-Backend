import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

export enum TipoPlan {
  GRATUITO = 'gratuito',
  PREMIUM = 'premium',
}

export enum NombreParametro {
  MAX_ANIMALES = 'maxAnimales',
  MAX_CULTIVOS = 'maxCultivos',
  MAX_RECORDATORIOS = 'maxRecordatorios',
}

@Entity('plan_config')
export class PlanConfig {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: TipoPlan })
  Tipo_Plan: TipoPlan;

  @Column({ type: 'enum', enum: NombreParametro })
  Nombre_Parametro: NombreParametro;

  @Column({ type: 'int' })
  Valor: number;

  @CreateDateColumn()
  Registro: Date;
}
