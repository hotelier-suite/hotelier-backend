import { Test, TestingModule } from '@nestjs/testing';
import { AuthController, AuthService } from './';

describe('AuthController', () => {
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

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should register a user', async () => {
    const result = { user: { id: 1 }, accessToken: 'at', refreshToken: 'rt' };
    mockService.register.mockResolvedValueOnce(result);
    const res = await controller.register({
      email: 'test@test.com',
      password: 'Pass@123',
      name: 'Test',
    });
    expect(res).toEqual(result);
  });

  it('should login a user', async () => {
    const result = { user: { id: 1 }, accessToken: 'at', refreshToken: 'rt' };
    mockService.login.mockResolvedValueOnce(result);
    const res = await controller.login({
      email: 'test@test.com',
      password: 'Pass@123',
    });
    expect(res).toEqual(result);
  });

  it('should logout a user', async () => {
    mockService.logout.mockResolvedValueOnce({
      message: 'Logged out successfully',
    });
    const res = await controller.logout(1);
    expect(res.message).toBe('Logged out successfully');
  });

  it('should refresh tokens', async () => {
    const tokens = { accessToken: 'new-at', refreshToken: 'new-rt' };
    mockService.refreshTokens.mockResolvedValueOnce(tokens);
    const res = await controller.refreshTokens({
      userId: 1,
      refreshToken: 'old-rt',
    });
    expect(res).toEqual(tokens);
  });

  it('should get profile', async () => {
    const profile = {
      id: 1,
      email: 'test@test.com',
      roles: [],
      permissions: [],
    };
    mockService.getProfile.mockResolvedValueOnce(profile);
    const res = await controller.getProfile(1);
    expect(res).toEqual(profile);
  });
});
