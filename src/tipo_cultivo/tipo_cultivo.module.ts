import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipoCultivo } from './entities/tipo_cultivo.entity';
import { TipoCultivoService } from './tipo_cultivo.service';
import { TipoCultivoController } from './tipo_cultivo.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TipoCultivo]),
    AuthModule
  ],
  controllers: [TipoCultivoController],
  providers: [TipoCultivoService],
  exports: [TipoCultivoService],
})
export class TipoCultivoModule {}