import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlanConfig } from './entities/plan_config.entity';
import { PlanConfigService } from './plan_config.service';
import { PlanConfigController } from './plan_config.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PlanConfig]),
    AuthModule,
  ],
  controllers: [PlanConfigController],
  providers: [PlanConfigService],
  exports: [PlanConfigService],
})
export class PlanConfigModule {}