import { Test, TestingModule } from '@nestjs/testing';
import { TokenRecuperacionController } from './token_recuperacion.controller';
import { TokenRecuperacionService } from './token_recuperacion.service';

describe('TokenRecuperacionController', () => {
  let controller: TokenRecuperacionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TokenRecuperacionController],
      providers: [TokenRecuperacionService],
    }).compile();

    controller = module.get<TokenRecuperacionController>(TokenRecuperacionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
