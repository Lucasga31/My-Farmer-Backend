import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cultivo } from './entities/cultivo.entity';
import { HistorialCultivo } from 'src/historial_cultivo/entities/historial_cultivo.entity';
import { CultivoService } from './cultivo.service';
import { CultivoController } from './cultivo.controller';
import { PlanConfigModule } from 'src/plan_config/plan_config.module';
import { UsuarioModule } from '../usuario/usuario.module';
import { TipoCultivoModule } from 'src/tipo_cultivo/tipo_cultivo.module';
import { ParcelaModule } from '../parcela/parcela.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cultivo, HistorialCultivo]),
    PlanConfigModule,
    UsuarioModule,
    TipoCultivoModule,
    ParcelaModule,
    AuthModule
  ],
  controllers: [CultivoController],
  providers: [CultivoService],
  exports: [CultivoService],
})
export class CultivoModule {}