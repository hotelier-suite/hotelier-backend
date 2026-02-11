import { Test, TestingModule } from '@nestjs/testing';
import { UsersController, UsersService } from './';
import { User } from './entities';

describe('UsersController', () => {
  let controller: UsersController;
  const mockService: Record<string, jest.Mock> = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    removeRolesFromUser: jest.fn(),
    getUserRoles: jest.fn(),
    getUserPermissionsList: jest.fn(),
  };

  const mockUser = { id: 1, email: 'test@test.com', name: 'Test' };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: mockService }],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should find all users', async () => {
    mockService.findAll.mockResolvedValueOnce([mockUser]);
    const result = await controller.findAll({});
    expect(result).toEqual([mockUser]);
  });

  it('should find one user', async () => {
    mockService.findOne.mockResolvedValueOnce(mockUser);
    const result = await controller.findOne(1);
    expect(result).toEqual(mockUser);
  });

  it('should create a user', async () => {
    mockService.create.mockResolvedValueOnce(mockUser);
    const data: Partial<User> = { email: 'test@test.com', name: 'Test' };
    const result = await controller.create(data);
    expect(result).toEqual(mockUser);
  });

  it('should update a user', async () => {
    const updated = { ...mockUser, name: 'Updated' };
    mockService.update.mockResolvedValueOnce(updated);
    const result = await controller.update({
      id: 1,
      data: { name: 'Updated' },
    });
    expect(result).toEqual(updated);
  });

  it('should remove a user', async () => {
    mockService.remove.mockResolvedValueOnce(mockUser);
    const result = await controller.remove(1);
    expect(result).toEqual(mockUser);
  });

  it('should remove roles from user', async () => {
    mockService.removeRolesFromUser.mockResolvedValueOnce(undefined);
    await controller.removeRolesFromUser({ userId: 1, roleIds: [2] });
    expect(mockService.removeRolesFromUser).toHaveBeenCalledWith(1, [2]);
  });

  it('should get user roles', async () => {
    const roles = [{ id: 1, name: 'admin' }];
    mockService.getUserRoles.mockResolvedValueOnce(roles);
    const result = await controller.getUserRoles(1);
    expect(result).toEqual(roles);
  });

  it('should get user permissions', async () => {
    const permissions = [{ id: 1, resource: 'users', action: 'create' }];
    mockService.getUserPermissionsList.mockResolvedValueOnce(permissions);
    const result = await controller.getUserPermissions(1);
    expect(result).toEqual(permissions);
  });
});
