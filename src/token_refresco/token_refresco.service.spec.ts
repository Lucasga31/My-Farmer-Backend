import { Test, TestingModule } from '@nestjs/testing';
import { TokenRefrescoService } from './token_refresco.service';

describe('TokenRefrescoService', () => {
  let service: TokenRefrescoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TokenRefrescoService],
    }).compile();

    service = module.get<TokenRefrescoService>(TokenRefrescoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
