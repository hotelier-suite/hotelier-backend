import { Test, TestingModule } from '@nestjs/testing';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import {
  CreateRoleDto,
  RoleResponseDto,
  FindRolesFilterDto,
} from '@app/contracts/auth-service';

describe('RolesController', () => {
  let controller: RolesController;
  let rolesService: jest.MockedFunction<RolesService[keyof RolesService]> &
    RolesService;

  const mockRole: RoleResponseDto = {
    id: 1,
    name: 'admin',
    description: 'Administrator role',
    isSystem: false,
    permissions: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const mockRolesService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
      removePermissionsFromRole: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [RolesController],
      providers: [
        {
          provide: RolesService,
          useValue: mockRolesService,
        },
      ],
    }).compile();

    controller = module.get<RolesController>(RolesController);
    rolesService = module.get(RolesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new role', async () => {
      const createDto: CreateRoleDto = {
        name: 'admin',
        description: 'Administrator role',
      };

      const createSpy = jest
        .spyOn(rolesService, 'create')
        .mockResolvedValue(mockRole);

      const result = await controller.create(createDto);

      expect(result).toEqual(mockRole);
      expect(createSpy).toHaveBeenCalledWith(createDto);
      expect(createSpy).toHaveBeenCalledTimes(1);
    });

    it('should handle creation errors', async () => {
      const createDto: CreateRoleDto = {
        name: 'admin',
        description: 'Administrator role',
      };
      const error = new Error('Role already exists');

      const createSpy = jest
        .spyOn(rolesService, 'create')
        .mockRejectedValue(error);

      await expect(controller.create(createDto)).rejects.toThrow(error);
      expect(createSpy).toHaveBeenCalledWith(createDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of roles', async () => {
      const filters: FindRolesFilterDto = {};
      const roles = [mockRole];

      const findAllSpy = jest
        .spyOn(rolesService, 'findAll')
        .mockResolvedValue(roles);

      const result = await controller.findAll(filters);

      expect(result).toEqual(roles);
      expect(findAllSpy).toHaveBeenCalledWith(filters);
      expect(findAllSpy).toHaveBeenCalledTimes(1);
    });

    it('should return filtered roles', async () => {
      const filters: FindRolesFilterDto = { name: 'admin' };
      const roles = [mockRole];

      const findAllSpy = jest
        .spyOn(rolesService, 'findAll')
        .mockResolvedValue(roles);

      const result = await controller.findAll(filters);

      expect(result).toEqual(roles);
      expect(findAllSpy).toHaveBeenCalledWith(filters);
    });

    it('should handle errors', async () => {
      const filters: FindRolesFilterDto = {};
      const error = new Error('Database error');

      jest.spyOn(rolesService, 'findAll').mockRejectedValue(error);

      await expect(controller.findAll(filters)).rejects.toThrow(error);
    });
  });

  describe('findOne', () => {
    it('should return a single role', async () => {
      const roleId = 1;

      const findOneSpy = jest
        .spyOn(rolesService, 'findOne')
        .mockResolvedValue(mockRole);

      const result = await controller.findOne(roleId);

      expect(result).toEqual(mockRole);
      expect(findOneSpy).toHaveBeenCalledWith(roleId);
      expect(findOneSpy).toHaveBeenCalledTimes(1);
    });

    it('should handle role not found', async () => {
      const roleId = 999;
      const error = new Error('Role not found');

      const findOneSpy = jest
        .spyOn(rolesService, 'findOne')
        .mockRejectedValue(error);

      await expect(controller.findOne(roleId)).rejects.toThrow(error);
      expect(findOneSpy).toHaveBeenCalledWith(roleId);
    });
  });

  describe('update', () => {
    it('should update a role', async () => {
      const payload = {
        id: 1,
        data: { description: 'Updated description' },
      };

      const updateSpy = jest
        .spyOn(rolesService, 'update')
        .mockResolvedValue(mockRole);

      const result = await controller.update(payload);

      expect(result).toEqual(mockRole);
      expect(updateSpy).toHaveBeenCalledWith(payload.id, payload.data);
      expect(updateSpy).toHaveBeenCalledTimes(1);
    });

    it('should handle update errors', async () => {
      const payload = {
        id: 999,
        data: { description: 'Updated description' },
      };
      const error = new Error('Role not found');

      jest.spyOn(rolesService, 'update').mockRejectedValue(error);

      await expect(controller.update(payload)).rejects.toThrow(error);
    });
  });

  describe('remove', () => {
    it('should remove a role', async () => {
      const roleId = 1;

      const removeSpy = jest
        .spyOn(rolesService, 'remove')
        .mockResolvedValue(mockRole);

      const result = await controller.remove(roleId);

      expect(result).toEqual(mockRole);
      expect(removeSpy).toHaveBeenCalledWith(roleId);
      expect(removeSpy).toHaveBeenCalledTimes(1);
    });

    it('should handle removal errors', async () => {
      const roleId = 999;
      const error = new Error('Role not found');

      jest.spyOn(rolesService, 'remove').mockRejectedValue(error);

      await expect(controller.remove(roleId)).rejects.toThrow(error);
    });
  });

  describe('removePermissionsFromRole', () => {
    it('should remove permissions from role', async () => {
      const payload = {
        roleId: 1,
        permissionIds: [1, 2],
      };

      const removePermissionsSpy = jest
        .spyOn(rolesService, 'removePermissionsFromRole')
        .mockResolvedValue(undefined);

      await controller.removePermissionsFromRole(payload);

      expect(removePermissionsSpy).toHaveBeenCalledWith(
        payload.roleId,
        payload.permissionIds,
      );
      expect(removePermissionsSpy).toHaveBeenCalledTimes(1);
    });

    it('should handle errors when removing permissions', async () => {
      const payload = {
        roleId: 999,
        permissionIds: [1],
      };
      const error = new Error('Role not found');

      jest
        .spyOn(rolesService, 'removePermissionsFromRole')
        .mockRejectedValue(error);

      await expect(
        controller.removePermissionsFromRole(payload),
      ).rejects.toThrow(error);
    });
  });
});
