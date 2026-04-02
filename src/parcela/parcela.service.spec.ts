import { Test, TestingModule } from '@nestjs/testing';
import { ParcelaService } from './parcela.service';

describe('ParcelaService', () => {
  let service: ParcelaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ParcelaService],
    }).compile();

    service = module.get<ParcelaService>(ParcelaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
