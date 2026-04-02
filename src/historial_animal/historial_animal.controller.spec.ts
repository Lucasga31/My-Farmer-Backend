import { Test, TestingModule } from '@nestjs/testing';
import { HistorialAnimalController } from './historial_animal.controller';
import { HistorialAnimalService } from './historial_animal.service';

describe('HistorialAnimalController', () => {
  let controller: HistorialAnimalController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HistorialAnimalController],
      providers: [HistorialAnimalService],
    }).compile();

    controller = module.get<HistorialAnimalController>(HistorialAnimalController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
