import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistorialCultivo } from './entities/historial_cultivo.entity';
import { HistorialCultivoService } from './historial_cultivo.service';
import { HistorialCultivoController } from './historial_cultivo.controller';
import { Cultivo } from 'src/cultivo/entities/cultivo.entity';
import { AuthModule } from 'src/auth/auth.module';
import { UsuarioModule } from 'src/usuario/usuario.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([HistorialCultivo, Cultivo]),
    AuthModule,
    UsuarioModule,
  ],
  controllers: [HistorialCultivoController],
  providers: [HistorialCultivoService],
  exports: [HistorialCultivoService],
})
export class HistorialCultivoModule {}