import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { TokenRefresco } from 'src/token_refresco/entities/token_refresco.entity';
import { TokenRecuperacion } from 'src/token_recuperacion/entities/token_recuperacion.entity';
import { Suscripcion } from 'src/suscripcion/entities/suscripcion.entity';
import { Parcela } from 'src/parcela/entities/parcela.entity';
import { Animal } from 'src/animal/entities/animal.entity';
import { Cultivo } from 'src/cultivo/entities/cultivo.entity';
import { Recordatorio } from 'src/recordatorio/entities/recordatorio.entity';

@Entity('usuario')
export class Usuario {
  @PrimaryGeneratedColumn()
  Usuario_id: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  Nombre: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  Apellido: string;

  @Column({ type: 'varchar', length: 150, unique: true })
  Correo: string;

  // opcional si quieres mantener contraseñas locales
  @Column({ type: 'varchar', length: 255, nullable: true })
  Contrasena: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  Foto: string | null;

  // se usa para mapear al usuario de Supabase
  @Column({ type: 'varchar', length: 255, nullable: true, unique: true })
  supabaseId: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  Auth_Provider: string | null;

  @Column({ type: 'boolean', default: true })
  Estado: boolean;

  @Column({ type: 'boolean', default: false })
  Premium: boolean;

  @Column({ type: 'timestamp', nullable: true })
  Expira: Date | null;

  @CreateDateColumn()
  Registro: Date;

  @UpdateDateColumn()
  Actualizado: Date;

  @OneToMany(() => TokenRefresco, token => token.Usuario)
  TokensRefresco: TokenRefresco[];

  @OneToMany(() => TokenRecuperacion, token => token.Usuario)
  TokensRecuperacion: TokenRecuperacion[];

  @OneToMany(() => Suscripcion, suscripcion => suscripcion.Usuario)
  Suscripciones: Suscripcion[];

  @OneToMany(() => Parcela, parcela => parcela.Usuario)
  Parcelas: Parcela[];

  @OneToMany(() => Animal, animal => animal.Usuario)
  Animales: Animal[];

  @OneToMany(() => Cultivo, cultivo => cultivo.Usuario)
  Cultivos: Cultivo[];

  @OneToMany(() => Recordatorio, recordatorio => recordatorio.Usuario)
  Recordatorios: Recordatorio[];
}