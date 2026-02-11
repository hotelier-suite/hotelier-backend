import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RpcException } from '@nestjs/microservices';
import { UsersService, User, UserRole } from './';
import { Role } from '../roles';
import { AccessControlService } from '../access-control';

describe('UsersService', () => {
  let service: UsersService;
  const mockUserRepo: Record<string, jest.Mock> = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };
  const mockRoleRepo: Record<string, jest.Mock> = {
    findOne: jest.fn(),
    createQueryBuilder: jest.fn(),
  };
  const mockUserRoleRepo = {
    create: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
    manager: { transaction: jest.fn() },
  };
  const mockAccessControlService: Record<string, jest.Mock> = {
    getUserRoles: jest.fn(),
    getUserPermissionsList: jest.fn(),
  };

  const mockUser = {
    id: 1,
    email: 'test@test.com',
    name: 'Test',
    isActive: true,
    userRoles: [{ id: 1, role: { id: 1, name: 'client' } }],
  };

  const mockTxnRepo: Record<string, jest.Mock> = {
    delete: jest.fn().mockResolvedValue(undefined),
    create: jest.fn().mockImplementation((val: unknown) => val),
    save: jest.fn().mockResolvedValue(undefined),
  };

  const mockQb: Record<string, jest.Mock> = {
    where: jest.fn().mockReturnThis(),
    getMany: jest.fn(),
  };

  beforeEach(async () => {
    mockRoleRepo.createQueryBuilder.mockReturnValue(mockQb);
    mockUserRoleRepo.manager = {
      transaction: jest
        .fn()
        .mockImplementation(
          (cb: (m: Record<string, unknown>) => Promise<void>) =>
            cb({ getRepository: jest.fn().mockReturnValue(mockTxnRepo) }),
        ),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useValue: mockUserRepo },
        { provide: getRepositoryToken(Role), useValue: mockRoleRepo },
        { provide: getRepositoryToken(UserRole), useValue: mockUserRoleRepo },
        {
          provide: AccessControlService,
          useValue: mockAccessControlService,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    jest.clearAllMocks();
    // Restore mocks that need to persist
    mockRoleRepo.createQueryBuilder.mockReturnValue(mockQb);
    mockUserRoleRepo.manager = {
      transaction: jest
        .fn()
        .mockImplementation(
          (cb: (m: Record<string, unknown>) => Promise<void>) =>
            cb({ getRepository: jest.fn().mockReturnValue(mockTxnRepo) }),
        ),
    };
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getDefaultRole', () => {
    it('should return provided roleId', async () => {
      const result = await service.getDefaultRole(5);
      expect(result).toBe(5);
    });

    it('should return default client role id', async () => {
      mockRoleRepo.findOne.mockResolvedValueOnce({ id: 4, name: 'client' });
      const result = await service.getDefaultRole();
      expect(result).toBe(4);
    });

    it('should throw when no default role found', async () => {
      mockRoleRepo.findOne.mockResolvedValueOnce(null);
      await expect(service.getDefaultRole()).rejects.toThrow(RpcException);
    });
  });

  describe('assignSingleRoleToUser', () => {
    it('should assign a role to user', async () => {
      mockUserRoleRepo.create.mockReturnValueOnce({
        userId: 1,
        roleId: 2,
        assignedBy: 'system',
      });
      mockUserRoleRepo.save.mockResolvedValueOnce(undefined);
      await service.assignSingleRoleToUser(1, 2);
      expect(mockUserRoleRepo.save).toHaveBeenCalled();
    });
  });

  describe('clearRefreshToken', () => {
    it('should clear refresh token', async () => {
      mockUserRepo.update.mockResolvedValueOnce(undefined);
      await service.clearRefreshToken(1);
      expect(mockUserRepo.update).toHaveBeenCalled();
    });
  });

  describe('updateLastLogin', () => {
    it('should update last login', async () => {
      mockUserRepo.update.mockResolvedValueOnce(undefined);
      await service.updateLastLogin(1);
      expect(mockUserRepo.update).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      mockUserRepo.find.mockResolvedValueOnce([mockUser]);
      const result = await service.findAll({});
      expect(result).toEqual([mockUser]);
    });

    it('should filter by email', async () => {
      mockUserRepo.find.mockResolvedValueOnce([mockUser]);
      const result = await service.findAll({ email: 'test' });
      expect(result).toEqual([mockUser]);
    });

    it('should filter by isActive', async () => {
      mockUserRepo.find.mockResolvedValueOnce([mockUser]);
      const result = await service.findAll({ isActive: true });
      expect(result).toEqual([mockUser]);
    });

    it('should filter by roleId', async () => {
      mockUserRepo.find.mockResolvedValueOnce([mockUser]);
      const result = await service.findAll({ roleId: 1 });
      expect(result).toEqual([mockUser]);
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      mockUserRepo.findOne.mockResolvedValueOnce(mockUser);
      const result = await service.findOne(1);
      expect(result).toEqual(mockUser);
    });

    it('should throw when not found', async () => {
      mockUserRepo.findOne.mockResolvedValueOnce(null);
      await expect(service.findOne(999)).rejects.toThrow(RpcException);
    });
  });

  describe('create', () => {
    it('should create a user', async () => {
      mockUserRepo.create.mockReturnValueOnce(mockUser);
      mockUserRepo.save.mockResolvedValueOnce(mockUser);
      mockUserRepo.findOne.mockResolvedValueOnce(mockUser);

      const result = await service.create({
        email: 'new@test.com',
        name: 'New',
      });
      expect(result).toEqual(mockUser);
    });

    it('should throw when user not found after creation', async () => {
      mockUserRepo.create.mockReturnValueOnce(mockUser);
      mockUserRepo.save.mockResolvedValueOnce(mockUser);
      mockUserRepo.findOne.mockResolvedValueOnce(null);

      await expect(
        service.create({ email: 'new@test.com', name: 'New' }),
      ).rejects.toThrow(RpcException);
    });
  });

  describe('update', () => {
    it('should update user data without roleIds', async () => {
      const updated = { ...mockUser, name: 'Updated' };
      mockUserRepo.findOne
        .mockResolvedValueOnce(mockUser) // existing check
        .mockResolvedValueOnce(updated); // final load
      mockUserRepo.update.mockResolvedValueOnce(undefined);

      const result = await service.update(1, { name: 'Updated' });
      expect(result).toEqual(updated);
    });

    it('should throw when user not found for update', async () => {
      mockUserRepo.findOne.mockResolvedValueOnce(null);
      await expect(service.update(999, { name: 'x' })).rejects.toThrow(
        RpcException,
      );
    });

    it('should throw when updated user not found', async () => {
      mockUserRepo.findOne
        .mockResolvedValueOnce(mockUser)
        .mockResolvedValueOnce(null);
      mockUserRepo.update.mockResolvedValueOnce(undefined);

      await expect(service.update(1, { name: 'x' })).rejects.toThrow(
        RpcException,
      );
    });

    it('should update with roleIds', async () => {
      const updated = { ...mockUser };
      mockUserRepo.findOne
        .mockResolvedValueOnce(mockUser)
        .mockResolvedValueOnce(updated);
      mockQb.getMany.mockResolvedValueOnce([{ id: 1 }, { id: 2 }]);

      const result = await service.update(1, {
        name: 'Updated',
        roleIds: [1, 2],
      });
      expect(result).toEqual(updated);
    });

    it('should handle empty data with roleIds', async () => {
      const updated = { ...mockUser };
      mockUserRepo.findOne
        .mockResolvedValueOnce(mockUser)
        .mockResolvedValueOnce(updated);
      mockQb.getMany.mockResolvedValueOnce([{ id: 1 }]);

      const result = await service.update(1, { roleIds: [1] });
      expect(result).toEqual(updated);
    });

    it('should throw when invalid roleIds provided', async () => {
      mockUserRepo.findOne.mockResolvedValueOnce(mockUser);

      await expect(service.update(1, { roleIds: [0, -1] })).rejects.toThrow(
        RpcException,
      );
    });

    it('should throw when roles do not exist', async () => {
      mockUserRepo.findOne.mockResolvedValueOnce(mockUser);
      mockQb.getMany.mockResolvedValueOnce([{ id: 1 }]); // only 1 found

      await expect(service.update(1, { roleIds: [1, 999] })).rejects.toThrow(
        RpcException,
      );
    });

    it('should handle empty roleIds array', async () => {
      const updated = { ...mockUser, userRoles: [] };
      mockUserRepo.findOne
        .mockResolvedValueOnce(mockUser)
        .mockResolvedValueOnce(updated);

      const result = await service.update(1, { roleIds: [] });
      expect(result).toEqual(updated);
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      mockUserRepo.findOne.mockResolvedValueOnce(mockUser);
      mockUserRepo.create.mockReturnValueOnce(mockUser);
      mockUserRepo.remove.mockResolvedValueOnce(mockUser);

      const result = await service.remove(1);
      expect(result).toEqual(mockUser);
    });
  });

  describe('removeRolesFromUser', () => {
    it('should remove roles from user', async () => {
      mockUserRoleRepo.delete.mockResolvedValueOnce(undefined);
      await service.removeRolesFromUser(1, [2]);
      expect(mockUserRoleRepo.delete).toHaveBeenCalled();
    });

    it('should not delete when roleIds is empty', async () => {
      await service.removeRolesFromUser(1, []);
      expect(mockUserRoleRepo.delete).not.toHaveBeenCalled();
    });
  });

  describe('getUserRoles', () => {
    it('should delegate to access control service', async () => {
      const roles = [{ id: 1, name: 'admin' }];
      mockAccessControlService.getUserRoles.mockResolvedValueOnce(roles);
      const result = await service.getUserRoles(1);
      expect(result).toEqual(roles);
    });
  });

  describe('getUserPermissionsList', () => {
    it('should delegate to access control service', async () => {
      const perms = [{ id: 1, resource: 'users', action: 'create' }];
      mockAccessControlService.getUserPermissionsList.mockResolvedValueOnce(
        perms,
      );
      const result = await service.getUserPermissionsList(1);
      expect(result).toEqual(perms);
    });
  });
});
