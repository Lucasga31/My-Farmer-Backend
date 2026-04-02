import { Test, TestingModule } from '@nestjs/testing';
import { TokenRecuperacionService } from './token_recuperacion.service';

describe('TokenRecuperacionService', () => {
  let service: TokenRecuperacionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TokenRecuperacionService],
    }).compile();

    service = module.get<TokenRecuperacionService>(TokenRecuperacionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
