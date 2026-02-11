import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AccessControlService } from './';
import { User, UserRole } from '../users/entities';

describe('AccessControlService', () => {
  let service: AccessControlService;
  const mockUserRepo: Record<string, jest.Mock> = {
    findOne: jest.fn(),
  };
  const mockUserRoleRepo: Record<string, jest.Mock> = {
    find: jest.fn(),
  };

  const mockPermission = { id: 1, resource: 'users', action: 'create' };
  const mockRolePermission = { id: 1, permission: mockPermission };
  const mockRole = {
    id: 1,
    name: 'admin',
    description: 'Admin',
    permissions: [mockRolePermission],
  };
  const mockUserRole = { id: 1, role: mockRole };
  const mockUser = {
    id: 1,
    email: 'test@test.com',
    name: 'Test',
    isActive: true,
    userRoles: [mockUserRole],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccessControlService,
        { provide: getRepositoryToken(User), useValue: mockUserRepo },
        { provide: getRepositoryToken(UserRole), useValue: mockUserRoleRepo },
      ],
    }).compile();

    service = module.get<AccessControlService>(AccessControlService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getUserWithRoles', () => {
    it('should get user by id', async () => {
      mockUserRepo.findOne.mockResolvedValueOnce(mockUser);
      const result = await service.getUserWithRoles(1);
      expect(result).toEqual(mockUser);
    });

    it('should get user by email', async () => {
      mockUserRepo.findOne.mockResolvedValueOnce(mockUser);
      const result = await service.getUserWithRoles('test@test.com');
      expect(result).toEqual(mockUser);
    });

    it('should return null when not found', async () => {
      mockUserRepo.findOne.mockResolvedValueOnce(null);
      const result = await service.getUserWithRoles(999);
      expect(result).toBeNull();
    });
  });

  describe('getUserWithRolesAndPassword', () => {
    it('should get user by id with password selected', async () => {
      mockUserRepo.findOne.mockResolvedValueOnce(mockUser);
      const result = await service.getUserWithRolesAndPassword(1);
      expect(result).toEqual(mockUser);
    });

    it('should get user by email', async () => {
      mockUserRepo.findOne.mockResolvedValueOnce(mockUser);
      const result = await service.getUserWithRolesAndPassword('test@test.com');
      expect(result).toEqual(mockUser);
    });
  });

  describe('getUserWithRefreshToken', () => {
    it('should get user with refresh token selected', async () => {
      mockUserRepo.findOne.mockResolvedValueOnce(mockUser);
      const result = service.getUserWithRefreshToken(1);
      await expect(result).resolves.toEqual(mockUser);
    });
  });

  describe('getUserPermissions', () => {
    it('should return permissions as resource:action strings', async () => {
      mockUserRepo.findOne.mockResolvedValueOnce(mockUser);
      const result = await service.getUserPermissions(1);
      expect(result).toContain('users:create');
    });

    it('should return empty array when user not found', async () => {
      mockUserRepo.findOne.mockResolvedValueOnce(null);
      const result = await service.getUserPermissions(999);
      expect(result).toEqual([]);
    });
  });

  describe('getUserRoles', () => {
    it('should return roles for a user', async () => {
      mockUserRoleRepo.find.mockResolvedValueOnce([mockUserRole]);
      const result = await service.getUserRoles(1);
      expect(result).toEqual([mockRole]);
    });
  });

  describe('getUserPermissionsList', () => {
    it('should return unique permissions from all roles', async () => {
      mockUserRoleRepo.find.mockResolvedValueOnce([mockUserRole]);
      const result = await service.getUserPermissionsList(1);
      expect(result).toEqual([mockPermission]);
    });

    it('should deduplicate permissions across roles', async () => {
      const duplicateUserRole = {
        id: 2,
        role: {
          id: 2,
          name: 'manager',
          permissions: [{ id: 2, permission: mockPermission }],
        },
      };
      mockUserRoleRepo.find.mockResolvedValueOnce([
        mockUserRole,
        duplicateUserRole,
      ]);
      const result = await service.getUserPermissionsList(1);
      expect(result).toHaveLength(1);
    });
  });
});
