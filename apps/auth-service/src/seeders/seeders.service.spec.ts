import { Test, TestingModule } from '@nestjs/testing';
import { SeedersService } from './';
import { PermissionsSeeder, RolesSeeder, UsersSeeder } from './domains';

describe('SeedersService', () => {
  let service: SeedersService;
  const mockPermissionsSeeder: Record<string, jest.Mock> = {
    seed: jest.fn(),
  };
  const mockRolesSeeder: Record<string, jest.Mock> = {
    seed: jest.fn(),
  };
  const mockUsersSeeder: Record<string, jest.Mock> = {
    seed: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SeedersService,
        { provide: PermissionsSeeder, useValue: mockPermissionsSeeder },
        { provide: RolesSeeder, useValue: mockRolesSeeder },
        { provide: UsersSeeder, useValue: mockUsersSeeder },
      ],
    }).compile();

    service = module.get<SeedersService>(SeedersService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call all seeders in order', async () => {
    const callOrder: string[] = [];
    mockPermissionsSeeder.seed.mockImplementation(() => {
      callOrder.push('permissions');
      return Promise.resolve();
    });
    mockRolesSeeder.seed.mockImplementation(() => {
      callOrder.push('roles');
      return Promise.resolve();
    });
    mockUsersSeeder.seed.mockImplementation(() => {
      callOrder.push('users');
      return Promise.resolve();
    });

    await service.seed();

    expect(callOrder).toEqual(['permissions', 'roles', 'users']);
  });
});
