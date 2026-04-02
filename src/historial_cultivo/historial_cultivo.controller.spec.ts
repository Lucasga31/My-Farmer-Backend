import { Test, TestingModule } from '@nestjs/testing';
import { HistorialCultivoController } from './historial_cultivo.controller';
import { HistorialCultivoService } from './historial_cultivo.service';

describe('HistorialCultivoController', () => {
  let controller: HistorialCultivoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HistorialCultivoController],
      providers: [HistorialCultivoService],
    }).compile();

    controller = module.get<HistorialCultivoController>(HistorialCultivoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
