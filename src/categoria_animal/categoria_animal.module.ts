import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriaAnimal } from './entities/categoria_animal.entity';
import { CategoriaAnimalService } from './categoria_animal.service';
import { CategoriaAnimalController } from './categoria_animal.controller';
import { UsuarioModule } from 'src/usuario/usuario.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CategoriaAnimal]),
    UsuarioModule,
    AuthModule
  ],
  controllers: [CategoriaAnimalController],
  providers: [CategoriaAnimalService],
  exports: [CategoriaAnimalService],
})
export class CategoriaAnimalModule {}