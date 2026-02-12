import { Test, TestingModule } from '@nestjs/testing';
import { PermissionsController } from './permissions.controller';
import { PermissionsService } from './permissions.service';
import {
  CreatePermissionDto,
  FindPermissionsFilterDto,
  PermissionResponseDto,
} from '@app/contracts/auth-service';

describe('PermissionsController', () => {
  let controller: PermissionsController;
  let permissionsService: jest.MockedFunction<
    PermissionsService[keyof PermissionsService]
  > &
    PermissionsService;

  const mockPermission: PermissionResponseDto = {
    id: 1,
    resource: 'users',
    action: 'read',
    description: 'Read users permission',
    active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const mockPermissionsService = {
      create: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PermissionsController],
      providers: [
        {
          provide: PermissionsService,
          useValue: mockPermissionsService,
        },
      ],
    }).compile();

    controller = module.get<PermissionsController>(PermissionsController);
    permissionsService = module.get(PermissionsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new permission', async () => {
      const createDto: CreatePermissionDto = {
        resource: 'users',
        action: 'read',
        description: 'Read users permission',
      };

      const createSpy = jest
        .spyOn(permissionsService, 'create')
        .mockResolvedValue(mockPermission);

      const result = await controller.create(createDto);

      expect(result).toEqual(mockPermission);
      expect(createSpy).toHaveBeenCalledWith(createDto);
      expect(createSpy).toHaveBeenCalledTimes(1);
    });

    it('should handle creation errors', async () => {
      const createDto: CreatePermissionDto = {
        resource: 'users',
        action: 'read',
        description: 'Read users permission',
      };
      const error = new Error('Permission already exists');

      const createSpy = jest
        .spyOn(permissionsService, 'create')
        .mockRejectedValue(error);

      await expect(controller.create(createDto)).rejects.toThrow(error);
      expect(createSpy).toHaveBeenCalledWith(createDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of permissions', async () => {
      const filters: FindPermissionsFilterDto = {};
      const permissions = [mockPermission];

      const findAllSpy = jest
        .spyOn(permissionsService, 'findAll')
        .mockResolvedValue(permissions);

      const result = await controller.findAll(filters);

      expect(result).toEqual(permissions);
      expect(findAllSpy).toHaveBeenCalledWith(filters);
      expect(findAllSpy).toHaveBeenCalledTimes(1);
    });

    it('should return filtered permissions', async () => {
      const filters: FindPermissionsFilterDto = { resource: 'users' };
      const permissions = [mockPermission];

      const findAllSpy = jest
        .spyOn(permissionsService, 'findAll')
        .mockResolvedValue(permissions);

      const result = await controller.findAll(filters);

      expect(result).toEqual(permissions);
      expect(findAllSpy).toHaveBeenCalledWith(filters);
    });

    it('should handle errors', async () => {
      const filters: FindPermissionsFilterDto = {};
      const error = new Error('Database error');

      jest.spyOn(permissionsService, 'findAll').mockRejectedValue(error);

      await expect(controller.findAll(filters)).rejects.toThrow(error);
    });
  });

  describe('update', () => {
    it('should update a permission', async () => {
      const payload = {
        id: 1,
        data: { description: 'Updated description' },
      };

      const updateSpy = jest
        .spyOn(permissionsService, 'update')
        .mockResolvedValue(mockPermission);

      const result = await controller.update(payload);

      expect(result).toEqual(mockPermission);
      expect(updateSpy).toHaveBeenCalledWith(payload.id, payload.data);
      expect(updateSpy).toHaveBeenCalledTimes(1);
    });

    it('should handle update errors', async () => {
      const payload = {
        id: 999,
        data: { description: 'Updated description' },
      };
      const error = new Error('Permission not found');

      jest.spyOn(permissionsService, 'update').mockRejectedValue(error);

      await expect(controller.update(payload)).rejects.toThrow(error);
    });
  });

  describe('remove', () => {
    it('should remove a permission', async () => {
      const permissionId = 1;

      const removeSpy = jest
        .spyOn(permissionsService, 'remove')
        .mockResolvedValue(mockPermission);

      const result = await controller.remove(permissionId);

      expect(result).toEqual(mockPermission);
      expect(removeSpy).toHaveBeenCalledWith(permissionId);
      expect(removeSpy).toHaveBeenCalledTimes(1);
    });

    it('should handle removal errors', async () => {
      const permissionId = 999;
      const error = new Error('Permission not found');

      jest.spyOn(permissionsService, 'remove').mockRejectedValue(error);

      await expect(controller.remove(permissionId)).rejects.toThrow(error);
    });
  });
});
