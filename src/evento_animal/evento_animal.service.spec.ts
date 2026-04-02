import { Test, TestingModule } from '@nestjs/testing';
import { EventoAnimalService } from './evento_animal.service';

describe('EventoAnimalService', () => {
  let service: EventoAnimalService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EventoAnimalService],
    }).compile();

    service = module.get<EventoAnimalService>(EventoAnimalService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
