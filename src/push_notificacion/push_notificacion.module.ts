import { Module } from '@nestjs/common';
import { PushNotificacionService } from './push_notificacion.service';

@Module({
  providers: [PushNotificacionService],
  exports: [PushNotificacionService],
})
export class PushNotificacionModule {}
