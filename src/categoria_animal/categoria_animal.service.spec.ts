import { Test, TestingModule } from '@nestjs/testing';
import { CategoriaAnimalService } from './categoria_animal.service';

describe('CategoriaAnimalService', () => {
  let service: CategoriaAnimalService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CategoriaAnimalService],
    }).compile();

    service = module.get<CategoriaAnimalService>(CategoriaAnimalService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
