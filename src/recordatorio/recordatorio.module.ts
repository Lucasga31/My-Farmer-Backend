import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recordatorio } from './entities/recordatorio.entity';
import { Animal } from 'src/animal/entities/animal.entity';
import { Cultivo } from 'src/cultivo/entities/cultivo.entity';
import { RecordatorioService } from './recordatorio.service';
import { RecordatorioController } from './recordatorio.controller';
import { PlanConfigModule } from 'src/plan_config/plan_config.module';
import { UsuarioModule } from '../usuario/usuario.module';
import { AuthModule } from 'src/auth/auth.module';
import { PushNotificacionModule } from 'src/push_notificacion/push_notificacion.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Recordatorio, Animal, Cultivo]),
    PlanConfigModule,
    UsuarioModule,
    AuthModule,
    PushNotificacionModule,
  ],
  controllers: [RecordatorioController],
  providers: [RecordatorioService],
  exports: [RecordatorioService],
})
export class RecordatorioModule {}