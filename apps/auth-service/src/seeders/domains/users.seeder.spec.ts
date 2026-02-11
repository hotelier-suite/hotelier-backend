import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

import * as bcrypt from 'bcrypt';
import { UsersSeeder } from './';
import { User, UserRole } from '../../users';
import { Role } from '../../roles';

const mockBcryptHash = bcrypt.hash as unknown as jest.Mock;

describe('UsersSeeder', () => {
  let seeder: UsersSeeder;
  const mockUserRepo: Record<string, jest.Mock> = {
    findOne: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
  };
  const mockRoleRepo: Record<string, jest.Mock> = {
    findOne: jest.fn(),
  };
  const mockUserRoleRepo: Record<string, jest.Mock> = {
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersSeeder,
        { provide: getRepositoryToken(User), useValue: mockUserRepo },
        { provide: getRepositoryToken(Role), useValue: mockRoleRepo },
        { provide: getRepositoryToken(UserRole), useValue: mockUserRoleRepo },
      ],
    }).compile();

    seeder = module.get<UsersSeeder>(UsersSeeder);
    jest.clearAllMocks();
    mockBcryptHash.mockResolvedValue('hashedPassword');
  });

  it('should be defined', () => {
    expect(seeder).toBeDefined();
  });

  it('should create users when none exist', async () => {
    mockUserRepo.findOne.mockResolvedValue(null);
    mockUserRepo.save.mockImplementation((data: Record<string, unknown>) =>
      Promise.resolve({ id: 1, ...data }),
    );
    mockRoleRepo.findOne.mockResolvedValue({ id: 1, name: 'admin' });
    mockUserRoleRepo.save.mockResolvedValue({});

    await seeder.seed();

    expect(mockUserRepo.save).toHaveBeenCalledTimes(7);
  });

  it('should update existing users', async () => {
    mockUserRepo.findOne.mockResolvedValue({ id: 1, email: 'admin@test.com' });
    mockUserRepo.update.mockResolvedValue(undefined);

    await seeder.seed();

    expect(mockUserRepo.update).toHaveBeenCalledTimes(7);
    expect(mockUserRepo.save).not.toHaveBeenCalled();
  });

  it('should assign roles to new users', async () => {
    mockUserRepo.findOne.mockResolvedValue(null);
    mockUserRepo.save.mockImplementation((data: Record<string, unknown>) =>
      Promise.resolve({ id: 1, ...data }),
    );
    mockRoleRepo.findOne.mockResolvedValue({ id: 1, name: 'admin' });
    mockUserRoleRepo.save.mockResolvedValue({});

    await seeder.seed();

    expect(mockUserRoleRepo.save).toHaveBeenCalled();
  });

  it('should skip role assignment when role not found', async () => {
    mockUserRepo.findOne.mockResolvedValue(null);
    mockUserRepo.save.mockImplementation((data: Record<string, unknown>) =>
      Promise.resolve({ id: 1, ...data }),
    );
    mockRoleRepo.findOne.mockResolvedValue(null);

    await seeder.seed();

    expect(mockUserRoleRepo.save).not.toHaveBeenCalled();
  });
});
