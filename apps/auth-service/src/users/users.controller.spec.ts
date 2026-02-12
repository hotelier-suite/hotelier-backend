import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import {
  UserResponseDto,
  RoleResponseDto,
  PermissionResponseDto,
  FindUsersFilterDto,
  LoyaltyLevel,
} from '@app/contracts/auth-service';
import { User } from './entities';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: jest.MockedFunction<UsersService[keyof UsersService]> &
    UsersService;

  const mockUser: UserResponseDto = {
    id: 1,
    email: 'test@example.com',
    name: 'Test User',
    loyaltyPoints: 0,
    loyaltyLevel: 'BRONZE' as unknown as LoyaltyLevel,
    registrationDate: new Date(),
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockRole: RoleResponseDto = {
    id: 1,
    name: 'admin',
    description: 'Administrator role',
    isSystem: false,
    permissions: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

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
    const mockUsersService = {
      findAll: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
      removeRolesFromUser: jest.fn(),
      getUserRoles: jest.fn(),
      getUserPermissionsList: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const filters: FindUsersFilterDto = {};
      const users = [mockUser];

      const findAllSpy = jest
        .spyOn(usersService, 'findAll')
        .mockResolvedValue(users);

      const result = await controller.findAll(filters);

      expect(result).toEqual(users);
      expect(findAllSpy).toHaveBeenCalledWith(filters);
      expect(findAllSpy).toHaveBeenCalledTimes(1);
    });

    it('should return filtered users', async () => {
      const filters: FindUsersFilterDto = { isActive: true };
      const users = [mockUser];

      const findAllSpy = jest
        .spyOn(usersService, 'findAll')
        .mockResolvedValue(users);

      const result = await controller.findAll(filters);

      expect(result).toEqual(users);
      expect(findAllSpy).toHaveBeenCalledWith(filters);
    });

    it('should handle errors', async () => {
      const filters: FindUsersFilterDto = {};
      const error = new Error('Database error');

      jest.spyOn(usersService, 'findAll').mockRejectedValue(error);

      await expect(controller.findAll(filters)).rejects.toThrow(error);
    });
  });

  describe('findOne', () => {
    it('should return a single user', async () => {
      const userId = 1;

      const findOneSpy = jest
        .spyOn(usersService, 'findOne')
        .mockResolvedValue(mockUser);

      const result = await controller.findOne(userId);

      expect(result).toEqual(mockUser);
      expect(findOneSpy).toHaveBeenCalledWith(userId);
      expect(findOneSpy).toHaveBeenCalledTimes(1);
    });

    it('should handle user not found', async () => {
      const userId = 999;
      const error = new Error('User not found');

      const findOneSpy = jest
        .spyOn(usersService, 'findOne')
        .mockRejectedValue(error);

      await expect(controller.findOne(userId)).rejects.toThrow(error);
      expect(findOneSpy).toHaveBeenCalledWith(userId);
    });
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const userData: Partial<User> = {
        email: 'new@example.com',
        name: 'New User',
      };

      const createSpy = jest
        .spyOn(usersService, 'create')
        .mockResolvedValue(mockUser);

      const result = await controller.create(userData);

      expect(result).toEqual(mockUser);
      expect(createSpy).toHaveBeenCalledWith(userData);
      expect(createSpy).toHaveBeenCalledTimes(1);
    });

    it('should handle creation errors', async () => {
      const userData: Partial<User> = {
        email: 'existing@example.com',
      };
      const error = new Error('Email already exists');

      jest.spyOn(usersService, 'create').mockRejectedValue(error);

      await expect(controller.create(userData)).rejects.toThrow(error);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const payload = {
        id: 1,
        data: { name: 'Updated' },
      };

      const updateSpy = jest
        .spyOn(usersService, 'update')
        .mockResolvedValue(mockUser);

      const result = await controller.update(payload);

      expect(result).toEqual(mockUser);
      expect(updateSpy).toHaveBeenCalledWith(payload.id, payload.data);
      expect(updateSpy).toHaveBeenCalledTimes(1);
    });

    it('should handle update errors', async () => {
      const payload = {
        id: 999,
        data: { name: 'Updated' },
      };
      const error = new Error('User not found');

      jest.spyOn(usersService, 'update').mockRejectedValue(error);

      await expect(controller.update(payload)).rejects.toThrow(error);
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      const userId = 1;

      const removeSpy = jest
        .spyOn(usersService, 'remove')
        .mockResolvedValue(mockUser);

      const result = await controller.remove(userId);

      expect(result).toEqual(mockUser);
      expect(removeSpy).toHaveBeenCalledWith(userId);
      expect(removeSpy).toHaveBeenCalledTimes(1);
    });

    it('should handle removal errors', async () => {
      const userId = 999;
      const error = new Error('User not found');

      jest.spyOn(usersService, 'remove').mockRejectedValue(error);

      await expect(controller.remove(userId)).rejects.toThrow(error);
    });
  });

  describe('removeRolesFromUser', () => {
    it('should remove roles from user', async () => {
      const payload = {
        userId: 1,
        roleIds: [1, 2],
      };

      const removeRolesSpy = jest
        .spyOn(usersService, 'removeRolesFromUser')
        .mockResolvedValue(undefined);

      await controller.removeRolesFromUser(payload);

      expect(removeRolesSpy).toHaveBeenCalledWith(
        payload.userId,
        payload.roleIds,
      );
      expect(removeRolesSpy).toHaveBeenCalledTimes(1);
    });

    it('should handle errors when removing roles', async () => {
      const payload = {
        userId: 999,
        roleIds: [1],
      };
      const error = new Error('User not found');

      jest.spyOn(usersService, 'removeRolesFromUser').mockRejectedValue(error);

      await expect(controller.removeRolesFromUser(payload)).rejects.toThrow(
        error,
      );
    });
  });

  describe('getUserRoles', () => {
    it('should return user roles', async () => {
      const userId = 1;
      const roles = [mockRole];

      const getUserRolesSpy = jest
        .spyOn(usersService, 'getUserRoles')
        .mockResolvedValue(roles);

      const result = await controller.getUserRoles(userId);

      expect(result).toEqual(roles);
      expect(getUserRolesSpy).toHaveBeenCalledWith(userId);
      expect(getUserRolesSpy).toHaveBeenCalledTimes(1);
    });

    it('should handle errors when getting roles', async () => {
      const userId = 999;
      const error = new Error('User not found');

      jest.spyOn(usersService, 'getUserRoles').mockRejectedValue(error);

      await expect(controller.getUserRoles(userId)).rejects.toThrow(error);
    });
  });

  describe('getUserPermissions', () => {
    it('should return user permissions', async () => {
      const userId = 1;
      const permissions = [mockPermission];

      const getPermissionsSpy = jest
        .spyOn(usersService, 'getUserPermissionsList')
        .mockResolvedValue(permissions);

      const result = await controller.getUserPermissions(userId);

      expect(result).toEqual(permissions);
      expect(getPermissionsSpy).toHaveBeenCalledWith(userId);
      expect(getPermissionsSpy).toHaveBeenCalledTimes(1);
    });

    it('should handle errors when getting permissions', async () => {
      const userId = 999;
      const error = new Error('User not found');

      jest
        .spyOn(usersService, 'getUserPermissionsList')
        .mockRejectedValue(error);

      await expect(controller.getUserPermissions(userId)).rejects.toThrow(
        error,
      );
    });
  });
});
