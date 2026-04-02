import { Test, TestingModule } from '@nestjs/testing';
import { RecordatorioService } from './recordatorio.service';

describe('RecordatorioService', () => {
  let service: RecordatorioService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RecordatorioService],
    }).compile();

    service = module.get<RecordatorioService>(RecordatorioService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
