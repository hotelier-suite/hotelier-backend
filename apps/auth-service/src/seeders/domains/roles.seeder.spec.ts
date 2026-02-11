import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RolesSeeder } from './';
import { Role, RolePermission } from '../../roles';
import { SystemPermission } from '../../permissions';

describe('RolesSeeder', () => {
  let seeder: RolesSeeder;
  const mockRoleRepo: Record<string, jest.Mock> = {
    findOne: jest.fn(),
    save: jest.fn(),
  };
  const mockPermRepo: Record<string, jest.Mock> = {
    findOne: jest.fn(),
  };
  const mockRolePermRepo: Record<string, jest.Mock> = {
    findOne: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesSeeder,
        { provide: getRepositoryToken(Role), useValue: mockRoleRepo },
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

    seeder = module.get<RolesSeeder>(RolesSeeder);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(seeder).toBeDefined();
  });

  it('should seed roles when none exist', async () => {
    mockRoleRepo.findOne.mockResolvedValue(null);
    mockRoleRepo.save.mockImplementation((data: Record<string, unknown>) =>
      Promise.resolve({ id: 1, ...data }),
    );
    mockPermRepo.findOne.mockResolvedValue({ id: 1 });
    mockRolePermRepo.findOne.mockResolvedValue(null);
    mockRolePermRepo.save.mockResolvedValue({});

    await seeder.seed();

    expect(mockRoleRepo.save).toHaveBeenCalledTimes(7);
  });

  it('should skip existing roles', async () => {
    mockRoleRepo.findOne.mockResolvedValue({ id: 1, name: 'admin' });
    mockPermRepo.findOne.mockResolvedValue({ id: 1 });
    mockRolePermRepo.findOne.mockResolvedValue(null);
    mockRolePermRepo.save.mockResolvedValue({});

    await seeder.seed();

    expect(mockRoleRepo.save).not.toHaveBeenCalled();
  });

  it('should skip permissions that do not exist', async () => {
    mockRoleRepo.findOne.mockResolvedValue(null);
    mockRoleRepo.save.mockImplementation((data: Record<string, unknown>) =>
      Promise.resolve({ id: 1, ...data }),
    );
    mockPermRepo.findOne.mockResolvedValue(null);

    await seeder.seed();

    expect(mockRolePermRepo.save).not.toHaveBeenCalled();
  });

  it('should skip existing role-permission assignments', async () => {
    mockRoleRepo.findOne.mockResolvedValue(null);
    mockRoleRepo.save.mockImplementation((data: Record<string, unknown>) =>
      Promise.resolve({ id: 1, ...data }),
    );
    mockPermRepo.findOne.mockResolvedValue({ id: 1 });
    mockRolePermRepo.findOne.mockResolvedValue({ id: 1 }); // already exists

    await seeder.seed();

    expect(mockRolePermRepo.save).not.toHaveBeenCalled();
  });
});
