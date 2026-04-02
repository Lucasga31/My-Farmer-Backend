import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Crecimiento } from './entities/crecimiento.entity';
import { Cultivo } from 'src/cultivo/entities/cultivo.entity';
import { CrecimientoService } from './crecimiento.service';
import { CrecimientoController } from './crecimiento.controller';
import { UsuarioModule } from 'src/usuario/usuario.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Crecimiento, Cultivo]), // ← agregar Cultivo
    UsuarioModule,
    AuthModule
  ],
  controllers: [CrecimientoController],
  providers: [CrecimientoService],
  exports: [CrecimientoService],
})
export class CrecimientoModule {}