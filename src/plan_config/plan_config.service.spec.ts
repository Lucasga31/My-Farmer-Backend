import { Test, TestingModule } from '@nestjs/testing';
import { PlanConfigService } from './plan_config.service';

describe('PlanConfigService', () => {
  let service: PlanConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlanConfigService],
    }).compile();

    service = module.get<PlanConfigService>(PlanConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
