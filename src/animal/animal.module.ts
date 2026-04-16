import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Animal } from './entities/animal.entity';
import { HistorialAnimal } from 'src/historial_animal/entities/historial_animal.entity';
import { AnimalService } from './animal.service';
import { AnimalController } from './animal.controller';
import { PlanConfigModule } from 'src/plan_config/plan_config.module';
import { UsuarioModule } from '../usuario/usuario.module';
import { CategoriaAnimalModule } from 'src/categoria_animal/categoria_animal.module';
import { ParcelaModule } from '../parcela/parcela.module';
import { EventoAnimalModule } from 'src/evento_animal/evento_animal.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Animal, HistorialAnimal]),
    PlanConfigModule,
    UsuarioModule,
    CategoriaAnimalModule,
    ParcelaModule,
    EventoAnimalModule,
    AuthModule,
  ],
  controllers: [AnimalController],
  providers: [AnimalService],
  exports: [AnimalService],
})
export class AnimalModule {}