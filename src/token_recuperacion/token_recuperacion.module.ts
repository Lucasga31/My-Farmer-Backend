import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenRecuperacion } from './entities/token_recuperacion.entity';
import { TokenRecuperacionService } from './token_recuperacion.service';
import { TokenRecuperacionController } from './token_recuperacion.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([TokenRecuperacion]),
  ],
  controllers: [TokenRecuperacionController],
  providers: [TokenRecuperacionService],
  exports: [TokenRecuperacionService],
})
export class TokenRecuperacionModule {}