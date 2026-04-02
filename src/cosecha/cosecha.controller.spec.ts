import { Test, TestingModule } from '@nestjs/testing';
import { CosechaController } from './cosecha.controller';
import { CosechaService } from './cosecha.service';

describe('CosechaController', () => {
  let controller: CosechaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CosechaController],
      providers: [CosechaService],
    }).compile();

    controller = module.get<CosechaController>(CosechaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
