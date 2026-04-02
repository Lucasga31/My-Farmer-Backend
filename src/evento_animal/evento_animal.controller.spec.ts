import { Test, TestingModule } from '@nestjs/testing';
import { EventoAnimalController } from './evento_animal.controller';
import { EventoAnimalService } from './evento_animal.service';

describe('EventoAnimalController', () => {
  let controller: EventoAnimalController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventoAnimalController],
      providers: [EventoAnimalService],
    }).compile();

    controller = module.get<EventoAnimalController>(EventoAnimalController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
