import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RpcException } from '@nestjs/microservices';
import { PermissionsService, SystemPermission } from './';
import { RolePermission } from '../roles';

describe('PermissionsService', () => {
  let service: PermissionsService;
  const mockPermRepo: Record<string, jest.Mock> = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    merge: jest.fn(),
    remove: jest.fn(),
  };
  const mockRolePermRepo: Record<string, jest.Mock> = {
    count: jest.fn(),
  };

  const mockPerm = {
    id: 1,
    resource: 'users',
    action: 'create',
    description: 'Create users',
    active: true,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PermissionsService,
        {
          provide: getRepositoryToken(SystemPermission),
          useValue: mockPermRepo,
        },
        {
          provide: getRepositoryToken(RolePermission),
          useValue: mockRolePermRepo,
        },
      ],
    }).compile();

    service = module.get<PermissionsService>(PermissionsService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a permission', async () => {
      mockPermRepo.create.mockReturnValueOnce(mockPerm);
      mockPermRepo.save.mockResolvedValueOnce(mockPerm);
      const result = await service.create({
        resource: 'users',
        action: 'create',
      });
      expect(result).toEqual(mockPerm);
    });
  });

  describe('findAll', () => {
    it('should return all permissions', async () => {
      mockPermRepo.find.mockResolvedValueOnce([mockPerm]);
      const result = await service.findAll({});
      expect(result).toEqual([mockPerm]);
    });

    it('should filter by resource', async () => {
      mockPermRepo.find.mockResolvedValueOnce([mockPerm]);
      const result = await service.findAll({ resource: 'users' });
      expect(result).toEqual([mockPerm]);
    });

    it('should filter by action', async () => {
      mockPermRepo.find.mockResolvedValueOnce([mockPerm]);
      const result = await service.findAll({ action: 'create' });
      expect(result).toEqual([mockPerm]);
    });
  });

  describe('findOne', () => {
    it('should return a permission by id', async () => {
      mockPermRepo.findOne.mockResolvedValueOnce(mockPerm);
      const result = await service.findOne(1);
      expect(result).toEqual(mockPerm);
    });

    it('should throw when not found', async () => {
      mockPermRepo.findOne.mockResolvedValueOnce(null);
      await expect(service.findOne(999)).rejects.toThrow(RpcException);
    });
  });

  describe('update', () => {
    it('should update a permission', async () => {
      const updated = { ...mockPerm, description: 'Updated' };
      mockPermRepo.findOne.mockResolvedValueOnce(mockPerm);
      mockPermRepo.create.mockReturnValueOnce(mockPerm);
      mockPermRepo.merge.mockReturnValueOnce(updated);
      mockPermRepo.save.mockResolvedValueOnce(updated);
      const result = await service.update(1, { description: 'Updated' });
      expect(result).toEqual(updated);
    });
  });

  describe('remove', () => {
    it('should remove a permission', async () => {
      mockPermRepo.findOne.mockResolvedValueOnce(mockPerm);
      mockRolePermRepo.count.mockResolvedValueOnce(0);
      mockPermRepo.create.mockReturnValueOnce(mockPerm);
      mockPermRepo.remove.mockResolvedValueOnce(mockPerm);
      const result = await service.remove(1);
      expect(result).toEqual(mockPerm);
    });

    it('should throw when permission is assigned to roles', async () => {
      mockPermRepo.findOne.mockResolvedValueOnce(mockPerm);
      mockRolePermRepo.count.mockResolvedValueOnce(3);
      await expect(service.remove(1)).rejects.toThrow(RpcException);
    });
  });
});
