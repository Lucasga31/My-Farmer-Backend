import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Suscripcion } from './entities/suscripcion.entity';
import { SuscripcionService } from './suscripcion.service';
import { SuscripcionController } from './suscripcion.controller';
import { UsuarioModule } from '../usuario/usuario.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Suscripcion]),
    UsuarioModule,
    AuthModule,
  ],
  controllers: [SuscripcionController],
  providers: [SuscripcionService],
  exports: [SuscripcionService],
})
export class SuscripcionModule {}