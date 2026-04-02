import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Usuario } from 'src/usuario/entities/usuario.entity';

@Entity('token_recuperacion')
export class TokenRecuperacion {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  Usuario_id: number;

  @Column({ type: 'int', default: 0 })
  Intentos: number;

  @Column({ type: 'varchar', length: 6 })
  Token: string;

  @Column({ type: 'timestamp' })
  Expira: Date;

  @Column({ type: 'timestamp', nullable: true })
  Usado_En: Date | null;

  @CreateDateColumn()
  Registro: Date;

  @ManyToOne(() => Usuario, usuario => usuario.TokensRecuperacion)
  @JoinColumn({ name: 'Usuario_id' })
  Usuario: Usuario;
}