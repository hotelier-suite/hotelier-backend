import { Test, TestingModule } from '@nestjs/testing';
import { PermissionsController, PermissionsService } from './';

describe('PermissionsController', () => {
  let controller: PermissionsController;
  const mockService: Record<string, jest.Mock> = {
    create: jest.fn(),
    findAll: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockPerm = { id: 1, resource: 'users', action: 'create' };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PermissionsController],
      providers: [{ provide: PermissionsService, useValue: mockService }],
    }).compile();

    controller = module.get<PermissionsController>(PermissionsController);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a permission', async () => {
    mockService.create.mockResolvedValueOnce(mockPerm);
    const result = await controller.create({
      resource: 'users',
      action: 'create',
    });
    expect(result).toEqual(mockPerm);
  });

  it('should find all permissions', async () => {
    mockService.findAll.mockResolvedValueOnce([mockPerm]);
    const result = await controller.findAll({});
    expect(result).toEqual([mockPerm]);
  });

  it('should update a permission', async () => {
    const updated = { ...mockPerm, description: 'Updated' };
    mockService.update.mockResolvedValueOnce(updated);
    const result = await controller.update({
      id: 1,
      data: { description: 'Updated' },
    });
    expect(result).toEqual(updated);
  });

  it('should remove a permission', async () => {
    mockService.remove.mockResolvedValueOnce(mockPerm);
    const result = await controller.remove(1);
    expect(result).toEqual(mockPerm);
  });
});
