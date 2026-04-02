import { Test, TestingModule } from '@nestjs/testing';
import { CrecimientoService } from './crecimiento.service';

describe('CrecimientoService', () => {
  let service: CrecimientoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CrecimientoService],
    }).compile();

    service = module.get<CrecimientoService>(CrecimientoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
