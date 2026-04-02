import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistorialAnimal } from './entities/historial_animal.entity';
import { HistorialAnimalService } from './historial_animal.service';
import { HistorialAnimalController } from './historial_animal.controller';
import { Animal } from 'src/animal/entities/animal.entity';
import { AuthModule } from 'src/auth/auth.module';
import { UsuarioModule } from 'src/usuario/usuario.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([HistorialAnimal, Animal]),
    AuthModule,
    UsuarioModule,
  ],
  controllers: [HistorialAnimalController],
  providers: [HistorialAnimalService],
  exports: [HistorialAnimalService],
})
export class HistorialAnimalModule {}