import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Parcela } from './entities/parcela.entity';
import { ParcelaService } from './parcela.service';
import { ParcelaController } from './parcela.controller';
import { UsuarioModule } from 'src/usuario/usuario.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Parcela]),
    UsuarioModule,
    AuthModule,
  ],
  controllers: [ParcelaController],
  providers: [ParcelaService],
  exports: [ParcelaService],
})
export class ParcelaModule {}