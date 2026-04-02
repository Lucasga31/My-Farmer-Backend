import { Test, TestingModule } from '@nestjs/testing';
import { ParcelaController } from './parcela.controller';
import { ParcelaService } from './parcela.service';

describe('ParcelaController', () => {
  let controller: ParcelaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ParcelaController],
      providers: [ParcelaService],
    }).compile();

    controller = module.get<ParcelaController>(ParcelaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
