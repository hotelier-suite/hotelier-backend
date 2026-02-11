import { Test, TestingModule } from '@nestjs/testing';
import { of, lastValueFrom } from 'rxjs';
import { UsersController, UsersService } from './';

describe('UsersController (gateway)', () => {
  let controller: UsersController;
  const mockService: Record<string, jest.Mock> = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    removeRolesFromUser: jest.fn(),
    getUserRoles: jest.fn(),
    getUserPermissions: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: mockService }],
    }).compile();
    controller = module.get<UsersController>(UsersController);
    jest.clearAllMocks();
  });

  it('should getMyProfile', async () => {
    mockService.findOne.mockReturnValueOnce(of({ id: 1 }));
    const result = await lastValueFrom(
      controller.getMyProfile({ id: 1, email: 'a@b.com' }),
    );
    expect(result).toHaveProperty('id');
  });

  it('should findAll', async () => {
    mockService.findAll.mockReturnValueOnce(of([]));
    const result = await lastValueFrom(controller.findAll({} as never));
    expect(result).toEqual([]);
  });

  it('should create', async () => {
    mockService.create.mockReturnValueOnce(of({ id: 1 }));
    const result = await lastValueFrom(controller.create({} as never));
    expect(result).toHaveProperty('id');
  });

  it('should findOne', async () => {
    mockService.findOne.mockReturnValueOnce(of({ id: 1 }));
    const result = await lastValueFrom(controller.findOne(1));
    expect(result).toHaveProperty('id');
  });

  it('should update', async () => {
    mockService.update.mockReturnValueOnce(of({ id: 1 }));
    const result = await lastValueFrom(controller.update(1, {} as never));
    expect(result).toHaveProperty('id');
  });

  it('should remove', async () => {
    mockService.remove.mockReturnValueOnce(of({ id: 1 }));
    const result = await lastValueFrom(controller.remove(1));
    expect(result).toHaveProperty('id');
  });

  it('should removeRolesFromUser', async () => {
    mockService.removeRolesFromUser.mockReturnValueOnce(of(undefined));
    await lastValueFrom(controller.removeRolesFromUser(1, 2));
    expect(mockService.removeRolesFromUser).toHaveBeenCalled();
  });

  it('should getUserRoles', async () => {
    mockService.getUserRoles.mockReturnValueOnce(of([]));
    const result = await lastValueFrom(controller.getUserRoles(1));
    expect(result).toEqual([]);
  });

  it('should getUserPermissions', async () => {
    mockService.getUserPermissions.mockReturnValueOnce(of([]));
    const result = await lastValueFrom(controller.getUserPermissions(1));
    expect(result).toEqual([]);
  });
});
