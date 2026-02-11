import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RpcException } from '@nestjs/microservices';

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

import * as bcrypt from 'bcrypt';
import { AuthService } from './';
import { User, UsersService } from '../users';
import { TokensService } from '../tokens';
import { AccessControlService } from '../access-control';

const mockBcryptHash = bcrypt.hash as unknown as jest.Mock;
const mockBcryptCompare = bcrypt.compare as unknown as jest.Mock;

describe('AuthService', () => {
  let service: AuthService;
  const mockUserRepo: Record<string, jest.Mock> = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };
  const mockTokensService: Record<string, jest.Mock> = {
    getTokens: jest.fn(),
    updateRefreshToken: jest.fn(),
  };
  const mockUsersService: Record<string, jest.Mock> = {
    getDefaultRole: jest.fn(),
    assignSingleRoleToUser: jest.fn(),
    updateLastLogin: jest.fn(),
    clearRefreshToken: jest.fn(),
  };
  const mockAccessControlService: Record<string, jest.Mock> = {
    getUserWithRoles: jest.fn(),
    getUserWithRolesAndPassword: jest.fn(),
    getUserWithRefreshToken: jest.fn(),
    getUserPermissions: jest.fn(),
  };

  const mockPermission = { id: 1, resource: 'users', action: 'create' };
  const mockRolePermission = { id: 1, permission: mockPermission };
  const mockRole = {
    id: 1,
    name: 'client',
    description: 'Client',
    permissions: [mockRolePermission],
  };
  const mockUserRole = { id: 1, role: mockRole };
  const mockUser = {
    id: 1,
    email: 'test@test.com',
    name: 'Test',
    password: 'hashedPw',
    isActive: true,
    refreshToken: 'hashedRt',
    userRoles: [mockUserRole],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getRepositoryToken(User), useValue: mockUserRepo },
        { provide: TokensService, useValue: mockTokensService },
        { provide: UsersService, useValue: mockUsersService },
        {
          provide: AccessControlService,
          useValue: mockAccessControlService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should register a new user', async () => {
      mockUserRepo.findOne.mockResolvedValueOnce(null);
      mockBcryptHash.mockResolvedValueOnce('hashedPw');
      mockUserRepo.create.mockReturnValueOnce(mockUser);
      mockUserRepo.save.mockResolvedValueOnce(mockUser);
      mockUsersService.getDefaultRole.mockResolvedValueOnce(1);
      mockUsersService.assignSingleRoleToUser.mockResolvedValueOnce(undefined);
      mockAccessControlService.getUserWithRoles.mockResolvedValueOnce(mockUser);
      mockTokensService.getTokens.mockResolvedValueOnce({
        accessToken: 'at',
        refreshToken: 'rt',
      });
      mockTokensService.updateRefreshToken.mockResolvedValueOnce(undefined);
      mockAccessControlService.getUserPermissions.mockResolvedValueOnce([
        'users:create',
      ]);

      const result = await service.register({
        email: 'test@test.com',
        password: 'Pass@123',
        name: 'Test',
      });

      expect(result.accessToken).toBe('at');
      expect(result.user).toBeDefined();
    });

    it('should throw when user already exists', async () => {
      mockUserRepo.findOne.mockResolvedValueOnce(mockUser);
      await expect(
        service.register({
          email: 'test@test.com',
          password: 'Pass@123',
          name: 'Test',
        }),
      ).rejects.toThrow(RpcException);
    });

    it('should throw when user with roles not found after creation', async () => {
      mockUserRepo.findOne.mockResolvedValueOnce(null);
      mockBcryptHash.mockResolvedValueOnce('hashedPw');
      mockUserRepo.create.mockReturnValueOnce(mockUser);
      mockUserRepo.save.mockResolvedValueOnce(mockUser);
      mockUsersService.getDefaultRole.mockResolvedValueOnce(1);
      mockUsersService.assignSingleRoleToUser.mockResolvedValueOnce(undefined);
      mockAccessControlService.getUserWithRoles.mockResolvedValueOnce(null);

      await expect(
        service.register({
          email: 'new@test.com',
          password: 'Pass@123',
          name: 'New',
        }),
      ).rejects.toThrow(RpcException);
    });

    it('should use provided roleId', async () => {
      mockUserRepo.findOne.mockResolvedValueOnce(null);
      mockBcryptHash.mockResolvedValueOnce('hashedPw');
      mockUserRepo.create.mockReturnValueOnce(mockUser);
      mockUserRepo.save.mockResolvedValueOnce(mockUser);
      mockUsersService.getDefaultRole.mockResolvedValueOnce(5);
      mockUsersService.assignSingleRoleToUser.mockResolvedValueOnce(undefined);
      mockAccessControlService.getUserWithRoles.mockResolvedValueOnce(mockUser);
      mockTokensService.getTokens.mockResolvedValueOnce({
        accessToken: 'at',
        refreshToken: 'rt',
      });
      mockTokensService.updateRefreshToken.mockResolvedValueOnce(undefined);
      mockAccessControlService.getUserPermissions.mockResolvedValueOnce([]);

      const result = await service.register({
        email: 'test2@test.com',
        password: 'Pass@123',
        name: 'Test2',
        roleId: 5,
      });

      expect(result.accessToken).toBe('at');
      expect(mockUsersService.getDefaultRole).toHaveBeenCalledWith(5);
    });

    it('should handle role with undefined description', async () => {
      const userWithNoDesc = {
        ...mockUser,
        userRoles: [
          {
            id: 1,
            role: {
              id: 1,
              name: 'client',
              description: '',
              permissions: [mockRolePermission],
            },
          },
        ],
      };
      mockUserRepo.findOne.mockResolvedValueOnce(null);
      mockBcryptHash.mockResolvedValueOnce('hashedPw');
      mockUserRepo.create.mockReturnValueOnce(mockUser);
      mockUserRepo.save.mockResolvedValueOnce(mockUser);
      mockUsersService.getDefaultRole.mockResolvedValueOnce(1);
      mockUsersService.assignSingleRoleToUser.mockResolvedValueOnce(undefined);
      mockAccessControlService.getUserWithRoles.mockResolvedValueOnce(
        userWithNoDesc,
      );
      mockTokensService.getTokens.mockResolvedValueOnce({
        accessToken: 'at',
        refreshToken: 'rt',
      });
      mockTokensService.updateRefreshToken.mockResolvedValueOnce(undefined);
      mockAccessControlService.getUserPermissions.mockResolvedValueOnce([]);

      const result = await service.register({
        email: 'test3@test.com',
        password: 'Pass@123',
        name: 'Test3',
      });

      expect(result.user.roles[0].description).toBeUndefined();
    });
  });

  describe('login', () => {
    it('should login with valid credentials', async () => {
      mockAccessControlService.getUserWithRolesAndPassword.mockResolvedValueOnce(
        mockUser,
      );
      mockBcryptCompare.mockResolvedValueOnce(true);
      mockTokensService.getTokens.mockResolvedValueOnce({
        accessToken: 'at',
        refreshToken: 'rt',
      });
      mockTokensService.updateRefreshToken.mockResolvedValueOnce(undefined);
      mockUsersService.updateLastLogin.mockResolvedValueOnce(undefined);
      mockAccessControlService.getUserPermissions.mockResolvedValueOnce([
        'users:create',
      ]);

      const result = await service.login({
        email: 'test@test.com',
        password: 'Pass@123',
      });

      expect(result.accessToken).toBe('at');
    });

    it('should throw when user not found', async () => {
      mockAccessControlService.getUserWithRolesAndPassword.mockResolvedValueOnce(
        null,
      );
      await expect(
        service.login({ email: 'no@test.com', password: 'pass' }),
      ).rejects.toThrow(RpcException);
    });

    it('should throw when user is inactive', async () => {
      mockAccessControlService.getUserWithRolesAndPassword.mockResolvedValueOnce(
        { ...mockUser, isActive: false },
      );
      await expect(
        service.login({ email: 'test@test.com', password: 'pass' }),
      ).rejects.toThrow(RpcException);
    });

    it('should throw when password is invalid', async () => {
      mockAccessControlService.getUserWithRolesAndPassword.mockResolvedValueOnce(
        mockUser,
      );
      mockBcryptCompare.mockResolvedValueOnce(false);
      await expect(
        service.login({ email: 'test@test.com', password: 'wrong' }),
      ).rejects.toThrow(RpcException);
    });

    it('should handle role with empty description', async () => {
      const userEmptyDesc = {
        ...mockUser,
        userRoles: [
          {
            id: 1,
            role: { id: 1, name: 'admin', description: '', permissions: [] },
          },
        ],
      };
      mockAccessControlService.getUserWithRolesAndPassword.mockResolvedValueOnce(
        userEmptyDesc,
      );
      mockBcryptCompare.mockResolvedValueOnce(true);
      mockTokensService.getTokens.mockResolvedValueOnce({
        accessToken: 'at',
        refreshToken: 'rt',
      });
      mockTokensService.updateRefreshToken.mockResolvedValueOnce(undefined);
      mockUsersService.updateLastLogin.mockResolvedValueOnce(undefined);
      mockAccessControlService.getUserPermissions.mockResolvedValueOnce([]);

      const result = await service.login({
        email: 'test@test.com',
        password: 'Pass@123',
      });

      expect(result.user.roles[0].description).toBeUndefined();
    });
  });

  describe('logout', () => {
    it('should clear refresh token and return message', async () => {
      mockUsersService.clearRefreshToken.mockResolvedValueOnce(undefined);
      const result = await service.logout(1);
      expect(result.message).toBe('Logged out successfully');
    });
  });

  describe('refreshTokens', () => {
    it('should refresh tokens with valid refresh token', async () => {
      mockAccessControlService.getUserWithRefreshToken.mockResolvedValueOnce(
        mockUser,
      );
      mockBcryptCompare.mockResolvedValueOnce(true);
      mockTokensService.getTokens.mockResolvedValueOnce({
        accessToken: 'new-at',
        refreshToken: 'new-rt',
      });
      mockTokensService.updateRefreshToken.mockResolvedValueOnce(undefined);

      const result = await service.refreshTokens(1, 'old-rt');
      expect(result.accessToken).toBe('new-at');
    });

    it('should throw when user not found', async () => {
      mockAccessControlService.getUserWithRefreshToken.mockResolvedValueOnce(
        null,
      );
      await expect(service.refreshTokens(1, 'rt')).rejects.toThrow(
        RpcException,
      );
    });

    it('should throw when no stored refresh token', async () => {
      mockAccessControlService.getUserWithRefreshToken.mockResolvedValueOnce({
        ...mockUser,
        refreshToken: null,
      });
      await expect(service.refreshTokens(1, 'rt')).rejects.toThrow(
        RpcException,
      );
    });

    it('should throw when refresh token does not match', async () => {
      mockAccessControlService.getUserWithRefreshToken.mockResolvedValueOnce(
        mockUser,
      );
      mockBcryptCompare.mockResolvedValueOnce(false);
      await expect(service.refreshTokens(1, 'wrong-rt')).rejects.toThrow(
        RpcException,
      );
    });
  });

  describe('getProfile', () => {
    it('should return user profile', async () => {
      mockAccessControlService.getUserWithRoles.mockResolvedValueOnce(mockUser);
      mockAccessControlService.getUserPermissions.mockResolvedValueOnce([
        'users:create',
      ]);

      const result = await service.getProfile(1);
      expect(result.permissions).toContain('users:create');
    });

    it('should throw when user not found', async () => {
      mockAccessControlService.getUserWithRoles.mockResolvedValueOnce(null);
      await expect(service.getProfile(999)).rejects.toThrow(RpcException);
    });

    it('should throw when user is inactive', async () => {
      mockAccessControlService.getUserWithRoles.mockResolvedValueOnce({
        ...mockUser,
        isActive: false,
      });
      await expect(service.getProfile(1)).rejects.toThrow(RpcException);
    });

    it('should handle role with empty description', async () => {
      const userEmptyDesc = {
        ...mockUser,
        userRoles: [
          {
            id: 1,
            role: { id: 1, name: 'admin', description: '' },
          },
        ],
      };
      mockAccessControlService.getUserWithRoles.mockResolvedValueOnce(
        userEmptyDesc,
      );
      mockAccessControlService.getUserPermissions.mockResolvedValueOnce([]);

      const result = await service.getProfile(1);
      expect(result.roles[0].description).toBeUndefined();
    });
  });
});
