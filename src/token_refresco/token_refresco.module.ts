import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenRefresco } from './entities/token_refresco.entity';
import { TokenRefrescoService } from './token_refresco.service';
import { TokenRefrescoController } from './token_refresco.controller';
import { UsuarioModule } from '../usuario/usuario.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TokenRefresco]),
    UsuarioModule, // ← agregar
  ],
  controllers: [TokenRefrescoController],
  providers: [TokenRefrescoService],
  exports: [TokenRefrescoService],
})
export class TokenRefrescoModule {}