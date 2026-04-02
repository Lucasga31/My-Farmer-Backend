import { Test, TestingModule } from '@nestjs/testing';
import { PlanConfigController } from './plan_config.controller';
import { PlanConfigService } from './plan_config.service';

describe('PlanConfigController', () => {
  let controller: PlanConfigController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlanConfigController],
      providers: [PlanConfigService],
    }).compile();

    controller = module.get<PlanConfigController>(PlanConfigController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
