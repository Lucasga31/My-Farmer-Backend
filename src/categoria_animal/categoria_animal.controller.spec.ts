import { Test, TestingModule } from '@nestjs/testing';
import { CategoriaAnimalController } from './categoria_animal.controller';
import { CategoriaAnimalService } from './categoria_animal.service';

describe('CategoriaAnimalController', () => {
  let controller: CategoriaAnimalController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriaAnimalController],
      providers: [CategoriaAnimalService],
    }).compile();

    controller = module.get<CategoriaAnimalController>(CategoriaAnimalController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
