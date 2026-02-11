import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RpcException } from '@nestjs/microservices';
import { RoomsService, Room } from './';

describe('RoomsService', () => {
  let service: RoomsService;
  const mockRepository: Record<string, jest.Mock> = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    merge: jest.fn(),
    remove: jest.fn(),
    update: jest.fn(),
  };

  const mockRoom = {
    id: 1,
    number: '101',
    type: 'INDIVIDUAL',
    price: 50.0,
    capacity: 1,
    isAvailable: true,
    description: 'Single room',
    createdAt: new Date(2024, 5, 15),
    updatedAt: new Date(2024, 5, 15),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoomsService,
        { provide: getRepositoryToken(Room), useValue: mockRepository },
      ],
    }).compile();

    service = module.get<RoomsService>(RoomsService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all rooms ordered by number', async () => {
      mockRepository.find.mockResolvedValueOnce([mockRoom]);
      const result = await service.findAll({});
      expect(result).toEqual([mockRoom]);
      expect(mockRepository.find).toHaveBeenCalledWith(
        expect.objectContaining({ order: { number: 'ASC' } }),
      );
    });

    it('should filter by type', async () => {
      mockRepository.find.mockResolvedValueOnce([mockRoom]);
      const result = await service.findAll({ type: 'INDIVIDUAL' as never });
      expect(result).toEqual([mockRoom]);
      expect(mockRepository.find).toHaveBeenCalled();
    });

    it('should filter by availability', async () => {
      mockRepository.find.mockResolvedValueOnce([mockRoom]);
      const result = await service.findAll({ available: true });
      expect(result).toEqual([mockRoom]);
      expect(mockRepository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a room by id', async () => {
      mockRepository.findOne.mockResolvedValueOnce(mockRoom);
      const result = await service.findOne(1);
      expect(result).toEqual(mockRoom);
    });

    it('should throw RpcException when not found', async () => {
      mockRepository.findOne.mockResolvedValueOnce(null);
      await expect(service.findOne(999)).rejects.toThrow(RpcException);
    });
  });

  describe('create', () => {
    it('should create a room', async () => {
      const createDto = {
        number: '101',
        type: 'INDIVIDUAL' as never,
        price: 50,
        capacity: 1,
      };
      mockRepository.findOne.mockResolvedValueOnce(null); // no duplicate
      mockRepository.create.mockReturnValueOnce(mockRoom);
      mockRepository.save.mockResolvedValueOnce(mockRoom);
      const result = await service.create(createDto);
      expect(result).toEqual(mockRoom);
    });

    it('should throw RpcException when room number already exists', async () => {
      const createDto = {
        number: '101',
        type: 'INDIVIDUAL' as never,
        price: 50,
        capacity: 1,
      };
      mockRepository.findOne.mockResolvedValueOnce(mockRoom); // duplicate
      await expect(service.create(createDto)).rejects.toThrow(RpcException);
    });
  });

  describe('update', () => {
    it('should update a room', async () => {
      const updated = { ...mockRoom, price: 60 };
      mockRepository.findOne.mockResolvedValueOnce(mockRoom); // findOne
      mockRepository.create.mockReturnValueOnce(mockRoom);
      mockRepository.merge.mockReturnValueOnce(updated);
      mockRepository.save.mockResolvedValueOnce(updated);
      const result = await service.update(1, { price: 60 });
      expect(result).toEqual(updated);
    });

    it('should check for duplicate number when changing', async () => {
      const updated = { ...mockRoom, number: '102' };
      mockRepository.findOne
        .mockResolvedValueOnce(mockRoom) // findOne
        .mockResolvedValueOnce(null); // no duplicate
      mockRepository.create.mockReturnValueOnce(mockRoom);
      mockRepository.merge.mockReturnValueOnce(updated);
      mockRepository.save.mockResolvedValueOnce(updated);
      const result = await service.update(1, { number: '102' });
      expect(result.number).toBe('102');
    });

    it('should throw when new number already exists', async () => {
      mockRepository.findOne
        .mockResolvedValueOnce(mockRoom) // findOne
        .mockResolvedValueOnce({ id: 2, number: '102' }); // duplicate
      await expect(service.update(1, { number: '102' })).rejects.toThrow(
        RpcException,
      );
    });

    it('should skip number check when number is same', async () => {
      mockRepository.findOne.mockResolvedValueOnce(mockRoom);
      mockRepository.create.mockReturnValueOnce(mockRoom);
      mockRepository.merge.mockReturnValueOnce(mockRoom);
      mockRepository.save.mockResolvedValueOnce(mockRoom);
      const result = await service.update(1, { number: '101' });
      expect(result).toEqual(mockRoom);
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('remove', () => {
    it('should remove a room', async () => {
      mockRepository.findOne.mockResolvedValueOnce(mockRoom);
      mockRepository.create.mockReturnValueOnce(mockRoom);
      mockRepository.remove.mockResolvedValueOnce(mockRoom);
      const result = await service.remove(1);
      expect(result).toEqual(mockRoom);
    });
  });

  describe('setAvailability', () => {
    it('should set room availability', async () => {
      const updated = { ...mockRoom, isAvailable: false };
      mockRepository.findOne.mockResolvedValueOnce(mockRoom);
      mockRepository.create.mockReturnValueOnce(mockRoom);
      mockRepository.merge.mockReturnValueOnce(updated);
      mockRepository.save.mockResolvedValueOnce(updated);
      const result = await service.setAvailability(1, false);
      expect(result.isAvailable).toBe(false);
    });
  });
});
