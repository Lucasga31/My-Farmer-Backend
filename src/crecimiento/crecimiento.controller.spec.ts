import { Test, TestingModule } from '@nestjs/testing';
import { CrecimientoController } from './crecimiento.controller';
import { CrecimientoService } from './crecimiento.service';

describe('CrecimientoController', () => {
  let controller: CrecimientoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CrecimientoController],
      providers: [CrecimientoService],
    }).compile();

    controller = module.get<CrecimientoController>(CrecimientoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
