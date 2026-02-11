import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PermissionsSeeder } from './';
import { SystemPermission } from '../../permissions';

describe('PermissionsSeeder', () => {
  let seeder: PermissionsSeeder;
  const mockPermRepo: Record<string, jest.Mock> = {
    findOne: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PermissionsSeeder,
        {
          provide: getRepositoryToken(SystemPermission),
          useValue: mockPermRepo,
        },
      ],
    }).compile();

    seeder = module.get<PermissionsSeeder>(PermissionsSeeder);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(seeder).toBeDefined();
  });

  it('should seed all permissions when none exist', async () => {
    mockPermRepo.findOne.mockResolvedValue(null);
    mockPermRepo.save.mockResolvedValue({});

    await seeder.seed();

    expect(mockPermRepo.save).toHaveBeenCalled();
    expect(mockPermRepo.findOne).toHaveBeenCalled();
  });

  it('should skip existing permissions', async () => {
    mockPermRepo.findOne.mockResolvedValue({ id: 1 });

    await seeder.seed();

    expect(mockPermRepo.save).not.toHaveBeenCalled();
  });
});
