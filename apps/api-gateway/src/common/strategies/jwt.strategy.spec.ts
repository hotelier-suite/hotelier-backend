import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtStrategy } from './';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: ConfigService,
          useValue: { get: jest.fn().mockReturnValue('test-secret') },
        },
      ],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  it('should return user from valid payload', () => {
    const result = strategy.validate({ sub: 1, email: 'test@test.com' });
    expect(result).toEqual({ id: 1, email: 'test@test.com' });
  });

  it('should throw on null payload', () => {
    expect(() => strategy.validate(null as never)).toThrow(
      UnauthorizedException,
    );
  });

  it('should throw on payload without sub', () => {
    expect(() =>
      strategy.validate({ sub: undefined, email: 'x' } as never),
    ).toThrow(UnauthorizedException);
  });
});
