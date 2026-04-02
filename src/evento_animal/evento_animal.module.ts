import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventoAnimal } from './entities/evento_animal.entity';
import { Animal } from 'src/animal/entities/animal.entity';
import { EventoAnimalService } from './evento_animal.service';
import { EventoAnimalController } from './evento_animal.controller';
import { UsuarioModule } from 'src/usuario/usuario.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([EventoAnimal, Animal]),
    UsuarioModule,
    AuthModule
  ],
  controllers: [EventoAnimalController],
  providers: [EventoAnimalService],
  exports: [EventoAnimalService],
})
export class EventoAnimalModule {}