import { Test, TestingModule } from '@nestjs/testing';
import { CosechaService } from './cosecha.service';

describe('CosechaService', () => {
  let service: CosechaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CosechaService],
    }).compile();

    service = module.get<CosechaService>(CosechaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
