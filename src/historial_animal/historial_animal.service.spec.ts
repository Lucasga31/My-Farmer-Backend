import { Test, TestingModule } from '@nestjs/testing';
import { HistorialAnimalService } from './historial_animal.service';

describe('HistorialAnimalService', () => {
  let service: HistorialAnimalService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HistorialAnimalService],
    }).compile();

    service = module.get<HistorialAnimalService>(HistorialAnimalService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
