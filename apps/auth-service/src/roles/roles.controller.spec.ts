import { Test, TestingModule } from '@nestjs/testing';
import { RolesController, RolesService } from './';

describe('RolesController', () => {
  let controller: RolesController;
  const mockService: Record<string, jest.Mock> = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    removePermissionsFromRole: jest.fn(),
  };

  const mockRole = {
    id: 1,
    name: 'administrator',
    description: 'Admin',
    isSystem: true,
    permissions: [],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RolesController],
      providers: [{ provide: RolesService, useValue: mockService }],
    }).compile();

    controller = module.get<RolesController>(RolesController);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a role', async () => {
    mockService.create.mockResolvedValueOnce(mockRole);
    const result = await controller.create({ name: 'administrator' });
    expect(result).toEqual(mockRole);
  });

  it('should find all roles', async () => {
    mockService.findAll.mockResolvedValueOnce([mockRole]);
    const result = await controller.findAll({});
    expect(result).toEqual([mockRole]);
  });

  it('should find one role', async () => {
    mockService.findOne.mockResolvedValueOnce(mockRole);
    const result = await controller.findOne(1);
    expect(result).toEqual(mockRole);
  });

  it('should update a role', async () => {
    const updated = { ...mockRole, name: 'updated' };
    mockService.update.mockResolvedValueOnce(updated);
    const result = await controller.update({
      id: 1,
      data: { name: 'updated' },
    });
    expect(result).toEqual(updated);
  });

  it('should remove a role', async () => {
    mockService.remove.mockResolvedValueOnce(mockRole);
    const result = await controller.remove(1);
    expect(result).toEqual(mockRole);
  });

  it('should remove permissions from role', async () => {
    mockService.removePermissionsFromRole.mockResolvedValueOnce(undefined);
    await controller.removePermissionsFromRole({
      roleId: 1,
      permissionIds: [1, 2],
    });
    expect(mockService.removePermissionsFromRole).toHaveBeenCalledWith(
      1,
      [1, 2],
    );
  });
});
