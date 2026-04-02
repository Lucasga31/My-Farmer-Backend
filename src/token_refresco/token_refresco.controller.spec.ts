import { Test, TestingModule } from '@nestjs/testing';
import { TokenRefrescoController } from './token_refresco.controller';
import { TokenRefrescoService } from './token_refresco.service';

describe('TokenRefrescoController', () => {
  let controller: TokenRefrescoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TokenRefrescoController],
      providers: [TokenRefrescoService],
    }).compile();

    controller = module.get<TokenRefrescoController>(TokenRefrescoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
