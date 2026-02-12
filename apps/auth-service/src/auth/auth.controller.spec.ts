import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import {
  RegisterDto,
  LoginDto,
  AuthResponseDto,
  LogoutResponseDto,
  ProfileResponseDto,
  TokenResponseDto,
  LoyaltyLevel,
} from '@app/contracts/auth-service';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthResponse: AuthResponseDto = {
    user: {
      id: 1,
      email: 'test@example.com',
      name: 'Test User',
      isActive: true,
      loyaltyPoints: 0,
      loyaltyLevel: 'BRONZE' as unknown as LoyaltyLevel,
      registrationDate: new Date(),
      roles: [],
      permissions: [],
    },
    accessToken: 'access-token',
    refreshToken: 'refresh-token',
  };

  const mockProfileResponse: ProfileResponseDto = {
    id: 1,
    email: 'test@example.com',
    name: 'Test User',
    isActive: true,
    loyaltyPoints: 0,
    loyaltyLevel: 'BRONZE' as unknown as LoyaltyLevel,
    registrationDate: new Date(),
    roles: [],
    permissions: [],
  };

  const mockTokenResponse: TokenResponseDto = {
    accessToken: 'new-access-token',
    refreshToken: 'new-refresh-token',
  };

  const mockLogoutResponse: LogoutResponseDto = {
    message: 'Logged out successfully',
  };

  beforeEach(async () => {
    const mockAuthService = {
      register: jest.fn(),
      login: jest.fn(),
      logout: jest.fn(),
      refreshTokens: jest.fn(),
      getProfile: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const registerDto: RegisterDto = {
        email: 'test@example.com',
        password: 'Password123!',
        name: 'Test User',
      };

      const registerSpy = jest
        .spyOn(authService, 'register')
        .mockResolvedValue(mockAuthResponse);

      const result = await controller.register(registerDto);

      expect(result).toEqual(mockAuthResponse);
      expect(registerSpy).toHaveBeenCalledWith(registerDto);
      expect(registerSpy).toHaveBeenCalledTimes(1);
    });

    it('should handle registration errors', async () => {
      const registerDto: RegisterDto = {
        email: 'test@example.com',
        password: 'Password123!',
        name: 'Test User',
      };

      const error = new Error('Email already exists');
      const registerSpy = jest
        .spyOn(authService, 'register')
        .mockRejectedValue(error);

      await expect(controller.register(registerDto)).rejects.toThrow(error);
      expect(registerSpy).toHaveBeenCalledWith(registerDto);
    });
  });

  describe('login', () => {
    it('should login a user with valid credentials', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      const loginSpy = jest
        .spyOn(authService, 'login')
        .mockResolvedValue(mockAuthResponse);

      const result = await controller.login(loginDto);

      expect(result).toEqual(mockAuthResponse);
      expect(loginSpy).toHaveBeenCalledWith(loginDto);
      expect(loginSpy).toHaveBeenCalledTimes(1);
    });

    it('should handle login errors', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      const error = new Error('Invalid credentials');
      const loginSpy = jest
        .spyOn(authService, 'login')
        .mockRejectedValue(error);

      await expect(controller.login(loginDto)).rejects.toThrow(error);
      expect(loginSpy).toHaveBeenCalledWith(loginDto);
    });
  });

  describe('logout', () => {
    it('should logout a user', async () => {
      const userId = 1;

      const logoutSpy = jest
        .spyOn(authService, 'logout')
        .mockResolvedValue(mockLogoutResponse);

      const result = await controller.logout(userId);

      expect(result).toEqual(mockLogoutResponse);
      expect(logoutSpy).toHaveBeenCalledWith(userId);
      expect(logoutSpy).toHaveBeenCalledTimes(1);
    });

    it('should handle logout errors', async () => {
      const userId = 1;
      const error = new Error('User not found');
      const logoutSpy = jest
        .spyOn(authService, 'logout')
        .mockRejectedValue(error);

      await expect(controller.logout(userId)).rejects.toThrow(error);
      expect(logoutSpy).toHaveBeenCalledWith(userId);
    });
  });

  describe('refreshTokens', () => {
    it('should refresh tokens with valid refresh token', async () => {
      const payload = {
        userId: 1,
        refreshToken: 'valid-refresh-token',
      };

      const refreshSpy = jest
        .spyOn(authService, 'refreshTokens')
        .mockResolvedValue(mockTokenResponse);

      const result = await controller.refreshTokens(payload);

      expect(result).toEqual(mockTokenResponse);
      expect(refreshSpy).toHaveBeenCalledWith(
        payload.userId,
        payload.refreshToken,
      );
      expect(refreshSpy).toHaveBeenCalledTimes(1);
    });

    it('should handle invalid refresh token', async () => {
      const payload = {
        userId: 1,
        refreshToken: 'invalid-refresh-token',
      };

      const error = new Error('Invalid refresh token');
      const refreshSpy = jest
        .spyOn(authService, 'refreshTokens')
        .mockRejectedValue(error);

      await expect(controller.refreshTokens(payload)).rejects.toThrow(error);
      expect(refreshSpy).toHaveBeenCalledWith(
        payload.userId,
        payload.refreshToken,
      );
    });
  });

  describe('getProfile', () => {
    it('should get user profile', async () => {
      const userId = 1;

      const profileSpy = jest
        .spyOn(authService, 'getProfile')
        .mockResolvedValue(mockProfileResponse);

      const result = await controller.getProfile(userId);

      expect(result).toEqual(mockProfileResponse);
      expect(profileSpy).toHaveBeenCalledWith(userId);
      expect(profileSpy).toHaveBeenCalledTimes(1);
    });

    it('should handle profile not found', async () => {
      const userId = 999;
      const error = new Error('User not found');
      const profileSpy = jest
        .spyOn(authService, 'getProfile')
        .mockRejectedValue(error);

      await expect(controller.getProfile(userId)).rejects.toThrow(error);
      expect(profileSpy).toHaveBeenCalledWith(userId);
    });
  });
});
