import { Test, TestingModule } from '@nestjs/testing';
import { of, lastValueFrom } from 'rxjs';
import { AuthController, AuthService } from './';

describe('AuthController (gateway)', () => {
  let controller: AuthController;
  const mockService: Record<string, jest.Mock> = {
    register: jest.fn(),
    login: jest.fn(),
    logout: jest.fn(),
    refreshTokens: jest.fn(),
    getProfile: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockService }],
    }).compile();
    controller = module.get<AuthController>(AuthController);
    jest.clearAllMocks();
  });

  it('should register', async () => {
    mockService.register.mockReturnValueOnce(of({ user: { id: 1 } }));
    const result = await lastValueFrom(
      controller.register({ email: 'a@b.com', password: '123' } as never),
    );
    expect(result).toHaveProperty('user');
  });

  it('should login', async () => {
    mockService.login.mockReturnValueOnce(of({ user: { id: 1 } }));
    const result = await lastValueFrom(
      controller.login({ email: 'a@b.com', password: '123' } as never),
    );
    expect(result).toHaveProperty('user');
  });

  it('should logout', async () => {
    mockService.logout.mockReturnValueOnce(of({ message: 'ok' }));
    const result = await lastValueFrom(
      controller.logout({ id: 1, email: 'a@b.com' }),
    );
    expect(result).toEqual({ message: 'ok' });
  });

  it('should refreshTokens', async () => {
    mockService.refreshTokens.mockReturnValueOnce(of({ accessToken: 'new' }));
    const result = await lastValueFrom(
      controller.refreshTokens({
        sub: 1,
        email: 'a@b.com',
        refreshToken: 'tok',
      }),
    );
    expect(result).toHaveProperty('accessToken');
  });

  it('should refreshTokens with null refreshToken', async () => {
    mockService.refreshTokens.mockReturnValueOnce(of({ accessToken: 'new' }));
    const result = await lastValueFrom(
      controller.refreshTokens({
        sub: 1,
        email: 'a@b.com',
        refreshToken: undefined,
      } as never),
    );
    expect(result).toHaveProperty('accessToken');
  });

  it('should getProfile', async () => {
    mockService.getProfile.mockReturnValueOnce(of({ id: 1 }));
    const result = await lastValueFrom(
      controller.getProfile({ id: 1, email: 'a@b.com' }),
    );
    expect(result).toHaveProperty('id');
  });
});
