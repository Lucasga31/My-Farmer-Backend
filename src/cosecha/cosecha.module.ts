import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cosecha } from './entities/cosecha.entity';
import { Cultivo } from 'src/cultivo/entities/cultivo.entity';
import { CosechaService } from './cosecha.service';
import { CosechaController } from './cosecha.controller';
import { UsuarioModule } from 'src/usuario/usuario.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cosecha, Cultivo]),
    UsuarioModule,
    AuthModule
  ],
  controllers: [CosechaController],
  providers: [CosechaService],
  exports: [CosechaService],
})
export class CosechaModule {}