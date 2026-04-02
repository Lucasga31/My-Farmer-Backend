import { Test, TestingModule } from '@nestjs/testing';
import { RecordatorioController } from './recordatorio.controller';
import { RecordatorioService } from './recordatorio.service';

describe('RecordatorioController', () => {
  let controller: RecordatorioController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecordatorioController],
      providers: [RecordatorioService],
    }).compile();

    controller = module.get<RecordatorioController>(RecordatorioController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
