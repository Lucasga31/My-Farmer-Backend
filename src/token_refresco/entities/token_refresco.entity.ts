import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Usuario } from 'src/usuario/entities/usuario.entity';

@Entity('token_refresco')
export class TokenRefresco {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  Usuario_id: number;

  @Column({ type: 'varchar', length: 255 })
  Token_Hash: string;

  @Column({ type: 'timestamp' })
  Expira: Date;

  @Column({ type: 'boolean', default: false })
  Revocado: boolean;

  @CreateDateColumn()
  Registro: Date;

  @ManyToOne(() => Usuario, usuario => usuario.TokensRefresco)
  @JoinColumn({ name: 'Usuario_id' })
  Usuario: Usuario;
}