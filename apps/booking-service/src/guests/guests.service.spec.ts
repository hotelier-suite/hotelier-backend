jest.mock('../reservations', () => ({
  Reservation: class Reservation {},
}));

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RpcException } from '@nestjs/microservices';
import { GuestsService, Guest } from './';

describe('GuestsService', () => {
  let service: GuestsService;
  const mockRepository: Record<string, jest.Mock> = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    merge: jest.fn(),
    remove: jest.fn(),
  };

  const mockGuest = {
    id: 1,
    name: 'John Smith',
    email: 'john@example.com',
    phone: '+1234567890',
    document: 'ABC123',
    vip: false,
    createdAt: new Date(2024, 5, 15),
    updatedAt: new Date(2024, 5, 15),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GuestsService,
        { provide: getRepositoryToken(Guest), useValue: mockRepository },
      ],
    }).compile();

    service = module.get<GuestsService>(GuestsService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all guests ordered by name ASC', async () => {
      mockRepository.find.mockResolvedValueOnce([mockGuest]);
      const result = await service.findAll();
      expect(result).toEqual([mockGuest]);
      expect(mockRepository.find).toHaveBeenCalledWith(
        expect.objectContaining({ order: { name: 'ASC' } }),
      );
    });

    it('should apply search filter when provided', async () => {
      mockRepository.find.mockResolvedValueOnce([mockGuest]);
      const result = await service.findAll({ search: 'john' });
      expect(result).toEqual([mockGuest]);
      expect(mockRepository.find).toHaveBeenCalled();
    });

    it('should return all guests without search filter', async () => {
      mockRepository.find.mockResolvedValueOnce([mockGuest]);
      const result = await service.findAll({});
      expect(result).toEqual([mockGuest]);
    });
  });

  describe('findOne', () => {
    it('should return a guest by id', async () => {
      mockRepository.findOne.mockResolvedValueOnce(mockGuest);
      const result = await service.findOne(1);
      expect(result).toEqual(mockGuest);
    });

    it('should throw RpcException when not found', async () => {
      mockRepository.findOne.mockResolvedValueOnce(null);
      await expect(service.findOne(999)).rejects.toThrow(RpcException);
    });
  });

  describe('create', () => {
    it('should create and save a guest', async () => {
      const createDto = {
        name: 'John Smith',
        email: 'john@example.com',
        vip: false,
      };
      mockRepository.findOne.mockResolvedValueOnce(null); // no duplicate
      mockRepository.create.mockReturnValueOnce(mockGuest);
      mockRepository.save.mockResolvedValueOnce(mockGuest);
      const result = await service.create(createDto);
      expect(result).toEqual(mockGuest);
    });

    it('should throw RpcException when email already exists', async () => {
      const createDto = {
        name: 'John Smith',
        email: 'john@example.com',
        vip: false,
      };
      mockRepository.findOne.mockResolvedValueOnce(mockGuest); // duplicate found
      await expect(service.create(createDto)).rejects.toThrow(RpcException);
    });
  });

  describe('update', () => {
    it('should update an existing guest', async () => {
      const updateDto = { name: 'John Updated' };
      const updated = { ...mockGuest, name: 'John Updated' };
      mockRepository.findOne.mockResolvedValueOnce(mockGuest); // findOne
      mockRepository.create.mockReturnValueOnce(mockGuest);
      mockRepository.merge.mockReturnValueOnce(updated);
      mockRepository.save.mockResolvedValueOnce(updated);
      const result = await service.update(1, updateDto);
      expect(result).toEqual(updated);
    });

    it('should check for email duplicates when email changes', async () => {
      const updateDto = { email: 'new@example.com' };
      mockRepository.findOne
        .mockResolvedValueOnce(mockGuest) // findOne (existing)
        .mockResolvedValueOnce(null); // no duplicate
      mockRepository.create.mockReturnValueOnce(mockGuest);
      mockRepository.merge.mockReturnValueOnce({
        ...mockGuest,
        email: 'new@example.com',
      });
      mockRepository.save.mockResolvedValueOnce({
        ...mockGuest,
        email: 'new@example.com',
      });
      const result = await service.update(1, updateDto);
      expect(result.email).toBe('new@example.com');
    });

    it('should throw RpcException when new email already exists', async () => {
      const updateDto = { email: 'existing@example.com' };
      mockRepository.findOne
        .mockResolvedValueOnce(mockGuest) // findOne
        .mockResolvedValueOnce({ id: 2, email: 'existing@example.com' }); // duplicate
      await expect(service.update(1, updateDto)).rejects.toThrow(RpcException);
    });

    it('should skip email check when email is same', async () => {
      const updateDto = { email: 'john@example.com', name: 'Updated' };
      mockRepository.findOne.mockResolvedValueOnce(mockGuest);
      mockRepository.create.mockReturnValueOnce(mockGuest);
      mockRepository.merge.mockReturnValueOnce({
        ...mockGuest,
        name: 'Updated',
      });
      mockRepository.save.mockResolvedValueOnce({
        ...mockGuest,
        name: 'Updated',
      });
      const result = await service.update(1, updateDto);
      expect(result.name).toBe('Updated');
      // findOne called once (not twice for dup check)
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('remove', () => {
    it('should remove a guest', async () => {
      mockRepository.findOne.mockResolvedValueOnce(mockGuest);
      mockRepository.create.mockReturnValueOnce(mockGuest);
      mockRepository.remove.mockResolvedValueOnce(mockGuest);
      const result = await service.remove(1);
      expect(result).toEqual(mockGuest);
    });
  });
});
