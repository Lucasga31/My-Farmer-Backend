import { Test, TestingModule } from '@nestjs/testing';
import { SupabaseAuthGuard } from './supabase-auth.guard';
import { ConfigService } from '@nestjs/config';

describe('SupabaseAuthGuard', () => {
  let guard: SupabaseAuthGuard;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SupabaseAuthGuard,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('some-secret-or-key'),
          },
        },
      ],
    }).compile();

    guard = module.get<SupabaseAuthGuard>(SupabaseAuthGuard);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });
});
