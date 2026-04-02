import { Test, TestingModule } from '@nestjs/testing';
import { HistorialCultivoService } from './historial_cultivo.service';

describe('HistorialCultivoService', () => {
  let service: HistorialCultivoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HistorialCultivoService],
    }).compile();

    service = module.get<HistorialCultivoService>(HistorialCultivoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
