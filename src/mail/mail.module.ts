import { Module } from '@nestjs/common';
import { MailService } from './mail.service';

@Module({
  providers: [MailService],
  exports: [MailService], // 👈 importante para usarlo en otros módulos
})
export class MailModule {}