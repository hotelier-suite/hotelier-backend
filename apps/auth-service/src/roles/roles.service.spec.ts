import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RpcException } from '@nestjs/microservices';
import { RolesService, Role, RolePermission } from './';
import { UserRole } from '../users/entities';

describe('RolesService', () => {
  let service: RolesService;
  const mockRoleRepo: Record<string, jest.Mock> = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };
  const mockRolePermRepo: Record<string, jest.Mock> = {
    create: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };
  const mockUserRoleRepo: Record<string, jest.Mock> = {
    count: jest.fn(),
  };

  const mockRole = {
    id: 1,
    name: 'administrator',
    description: 'Admin',
    isSystem: true,
    permissions: [
      { id: 1, permission: { id: 1, resource: 'users', action: 'create' } },
    ],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesService,
        { provide: getRepositoryToken(Role), useValue: mockRoleRepo },
        {
          provide: getRepositoryToken(RolePermission),
          useValue: mockRolePermRepo,
        },
        { provide: getRepositoryToken(UserRole), useValue: mockUserRoleRepo },
      ],
    }).compile();

    service = module.get<RolesService>(RolesService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a role', async () => {
      mockRoleRepo.create.mockReturnValueOnce(mockRole);
      mockRoleRepo.save.mockResolvedValueOnce(mockRole);
      mockRoleRepo.findOne.mockResolvedValueOnce(mockRole);

      const result = await service.create({ name: 'administrator' });
      expect(result).toEqual(mockRole);
    });

    it('should throw when role fails to load after creation', async () => {
      mockRoleRepo.create.mockReturnValueOnce(mockRole);
      mockRoleRepo.save.mockResolvedValueOnce(mockRole);
      mockRoleRepo.findOne.mockResolvedValueOnce(null);

      await expect(service.create({ name: 'administrator' })).rejects.toThrow(
        RpcException,
      );
    });

    it('should throw 409 on duplicate name', async () => {
      const dbError = new Error('duplicate');
      (dbError as unknown as Record<string, unknown>).code = '23505';
      mockRoleRepo.create.mockReturnValueOnce(mockRole);
      mockRoleRepo.save.mockRejectedValueOnce(dbError);

      await expect(service.create({ name: 'administrator' })).rejects.toThrow(
        RpcException,
      );
    });

    it('should rethrow RpcException', async () => {
      mockRoleRepo.create.mockReturnValueOnce(mockRole);
      mockRoleRepo.save.mockResolvedValueOnce(mockRole);
      mockRoleRepo.findOne.mockRejectedValueOnce(
        new RpcException({ statusCode: 500, message: 'Error' }),
      );

      await expect(service.create({ name: 'test' })).rejects.toThrow(
        RpcException,
      );
    });

    it('should throw 500 on unknown error', async () => {
      mockRoleRepo.create.mockReturnValueOnce(mockRole);
      mockRoleRepo.save.mockRejectedValueOnce(new Error('unknown'));

      await expect(service.create({ name: 'test' })).rejects.toThrow(
        RpcException,
      );
    });
  });

  describe('findAll', () => {
    it('should return all roles', async () => {
      mockRoleRepo.find.mockResolvedValueOnce([mockRole]);
      const result = await service.findAll({});
      expect(result).toEqual([mockRole]);
    });

    it('should filter by name', async () => {
      mockRoleRepo.find.mockResolvedValueOnce([mockRole]);
      const result = await service.findAll({ name: 'admin' });
      expect(result).toEqual([mockRole]);
    });
  });

  describe('findOne', () => {
    it('should return a role by id', async () => {
      mockRoleRepo.findOne.mockResolvedValueOnce(mockRole);
      const result = await service.findOne(1);
      expect(result).toEqual(mockRole);
    });

    it('should throw when not found', async () => {
      mockRoleRepo.findOne.mockResolvedValueOnce(null);
      await expect(service.findOne(999)).rejects.toThrow(RpcException);
    });
  });

  describe('update', () => {
    it('should update role data', async () => {
      const updated = { ...mockRole, description: 'Updated' };
      mockRoleRepo.findOne
        .mockResolvedValueOnce(mockRole) // existing check
        .mockResolvedValueOnce(updated); // final load
      mockRoleRepo.update.mockResolvedValueOnce(undefined);

      const result = await service.update(1, { description: 'Updated' });
      expect(result).toEqual(updated);
    });

    it('should update permissions when permissionIds provided', async () => {
      const updated = { ...mockRole };
      mockRoleRepo.findOne
        .mockResolvedValueOnce(mockRole)
        .mockResolvedValueOnce(updated);
      mockRolePermRepo.delete.mockResolvedValueOnce(undefined);
      mockRolePermRepo.create.mockReturnValueOnce([]);
      mockRolePermRepo.save.mockResolvedValueOnce([]);

      const result = await service.update(1, {
        permissionIds: [1, 2],
      });
      expect(result).toEqual(updated);
    });

    it('should handle empty permissionIds', async () => {
      const updated = { ...mockRole, permissions: [] };
      mockRoleRepo.findOne
        .mockResolvedValueOnce(mockRole)
        .mockResolvedValueOnce(updated);
      mockRolePermRepo.delete.mockResolvedValueOnce(undefined);

      const result = await service.update(1, { permissionIds: [] });
      expect(result).toEqual(updated);
    });

    it('should throw when role not found', async () => {
      mockRoleRepo.findOne.mockResolvedValueOnce(null);
      await expect(service.update(999, { name: 'x' })).rejects.toThrow(
        RpcException,
      );
    });

    it('should throw when updated role not found', async () => {
      mockRoleRepo.findOne
        .mockResolvedValueOnce(mockRole)
        .mockResolvedValueOnce(null);
      mockRoleRepo.update.mockResolvedValueOnce(undefined);

      await expect(service.update(1, { name: 'updated' })).rejects.toThrow(
        RpcException,
      );
    });

    it('should throw 409 on duplicate name in update', async () => {
      const dbError = new Error('duplicate');
      (dbError as unknown as Record<string, unknown>).code = '23505';
      mockRoleRepo.findOne.mockResolvedValueOnce(mockRole);
      mockRoleRepo.update.mockRejectedValueOnce(dbError);

      await expect(service.update(1, { name: 'duplicate' })).rejects.toThrow(
        RpcException,
      );
    });

    it('should rethrow RpcException in update', async () => {
      mockRoleRepo.findOne.mockResolvedValueOnce(mockRole);
      mockRoleRepo.update.mockRejectedValueOnce(
        new RpcException({ statusCode: 404, message: 'test' }),
      );

      await expect(service.update(1, { name: 'x' })).rejects.toThrow(
        RpcException,
      );
    });

    it('should throw 500 on unknown error in update', async () => {
      mockRoleRepo.findOne.mockResolvedValueOnce(mockRole);
      mockRoleRepo.update.mockRejectedValueOnce(new Error('unknown'));

      await expect(service.update(1, { name: 'x' })).rejects.toThrow(
        RpcException,
      );
    });
  });

  describe('remove', () => {
    it('should remove a non-system role', async () => {
      const nonSystemRole = { ...mockRole, isSystem: false };
      mockRoleRepo.findOne.mockResolvedValueOnce(nonSystemRole);
      mockUserRoleRepo.count.mockResolvedValueOnce(0);
      mockRoleRepo.create.mockReturnValueOnce(nonSystemRole);
      mockRoleRepo.remove.mockResolvedValueOnce(nonSystemRole);

      const result = await service.remove(1);
      expect(result).toEqual(nonSystemRole);
    });

    it('should throw when deleting system role', async () => {
      mockRoleRepo.findOne.mockResolvedValueOnce(mockRole);
      await expect(service.remove(1)).rejects.toThrow(RpcException);
    });

    it('should throw when role has users', async () => {
      const nonSystemRole = { ...mockRole, isSystem: false };
      mockRoleRepo.findOne.mockResolvedValueOnce(nonSystemRole);
      mockUserRoleRepo.count.mockResolvedValueOnce(5);

      await expect(service.remove(1)).rejects.toThrow(RpcException);
    });
  });

  describe('removePermissionsFromRole', () => {
    it('should remove permissions from role', async () => {
      mockRolePermRepo.delete.mockResolvedValueOnce(undefined);
      await service.removePermissionsFromRole(1, [5]);
      expect(mockRolePermRepo.delete).toHaveBeenCalled();
    });

    it('should handle empty permissionIds', async () => {
      mockRolePermRepo.delete.mockResolvedValueOnce(undefined);
      await service.removePermissionsFromRole(1, []);
      expect(mockRolePermRepo.delete).toHaveBeenCalled();
    });
  });
});
