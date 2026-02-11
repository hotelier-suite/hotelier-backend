import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtRefreshStrategy } from './';

describe('JwtRefreshStrategy', () => {
  let strategy: JwtRefreshStrategy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtRefreshStrategy,
        {
          provide: ConfigService,
          useValue: { get: jest.fn().mockReturnValue('test-secret') },
        },
      ],
    }).compile();

    strategy = module.get<JwtRefreshStrategy>(JwtRefreshStrategy);
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  it('should return user with refresh token', () => {
    const req = {
      get: jest.fn().mockReturnValue('Bearer some-refresh-token'),
    } as never;
    const payload = { sub: 1, email: 'test@test.com' };
    const result = strategy.validate(req, payload);
    expect(result).toEqual({
      sub: 1,
      email: 'test@test.com',
      refreshToken: 'some-refresh-token',
    });
  });

  it('should handle missing authorization header', () => {
    const req = { get: jest.fn().mockReturnValue(undefined) } as never;
    const payload = { sub: 1, email: 'test@test.com' };
    const result = strategy.validate(req, payload);
    expect(result).toEqual({
      sub: 1,
      email: 'test@test.com',
      refreshToken: undefined,
    });
  });
});
