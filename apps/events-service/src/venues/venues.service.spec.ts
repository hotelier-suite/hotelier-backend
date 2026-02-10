// Break circular dependency: venue.entity -> ../../bookings barrel
jest.mock('../bookings', () => ({
  EventBooking: class EventBooking {},
}));

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RpcException } from '@nestjs/microservices';
import { VenuesService } from './venues.service';
import { Venue } from './entities';

describe('VenuesService', () => {
  let service: VenuesService;
  let repository: Record<string, jest.Mock>;

  const mockVenue = {
    id: 1,
    name: 'Grand Ballroom',
    capacity: 200,
    area: 400.0,
    hourlyRate: 500.0,
    available: true,
    location: 'Main Building - Ground Floor',
    description: 'Elegant ballroom for events.',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    repository = {
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      merge: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VenuesService,
        { provide: getRepositoryToken(Venue), useValue: repository },
      ],
    }).compile();

    service = module.get(VenuesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all venues ordered by name', async () => {
      repository.find.mockResolvedValueOnce([mockVenue]);
      const result = await service.findAll({});
      expect(result).toEqual([mockVenue]);
      expect(repository.find).toHaveBeenCalledWith(
        expect.objectContaining({ order: { name: 'ASC' } }),
      );
    });

    it('should filter by availability', async () => {
      repository.find.mockResolvedValueOnce([mockVenue]);
      await service.findAll({ isAvailable: true });
      expect(repository.find).toHaveBeenCalledWith(
        expect.objectContaining({ where: { available: true } }),
      );
    });

    it('should filter by minimum capacity', async () => {
      repository.find.mockResolvedValueOnce([mockVenue]);
      await service.findAll({ minCapacity: 100 });
      expect(repository.find).toHaveBeenCalled();
    });

    it('should filter by name with LIKE', async () => {
      repository.find.mockResolvedValueOnce([mockVenue]);
      await service.findAll({ name: 'Ball' });
      expect(repository.find).toHaveBeenCalled();
    });

    it('should return empty array when no venues match', async () => {
      repository.find.mockResolvedValueOnce([]);
      const result = await service.findAll({});
      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a single venue by id', async () => {
      repository.findOne.mockResolvedValueOnce(mockVenue);
      const result = await service.findOne(1);
      expect(result).toEqual(mockVenue);
      expect(repository.findOne).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: 1 } }),
      );
    });

    it('should throw RpcException when venue not found', async () => {
      repository.findOne.mockResolvedValueOnce(null);
      await expect(service.findOne(999)).rejects.toThrow(RpcException);
    });
  });

  describe('create', () => {
    it('should create and return a new venue', async () => {
      const createDto = {
        name: 'New Venue',
        capacity: 100,
        area: 200.0,
        hourlyRate: 300.0,
        location: 'East Wing',
      };
      const entity = { ...createDto };
      const saved = { ...mockVenue, ...createDto, id: 2 };
      repository.create.mockReturnValueOnce(entity);
      repository.save.mockResolvedValueOnce(saved);
      const result = await service.create(createDto);
      expect(result).toEqual(saved);
      expect(repository.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('update', () => {
    it('should update and return the venue', async () => {
      const updateDto = { name: 'Updated Venue' };
      const entity = { ...mockVenue };
      const merged = { ...mockVenue, ...updateDto };
      repository.findOne.mockResolvedValueOnce(mockVenue);
      repository.create.mockReturnValueOnce(entity);
      repository.merge.mockReturnValueOnce(merged);
      repository.save.mockResolvedValueOnce(merged);
      const result = await service.update(1, updateDto);
      expect(result).toEqual(merged);
      expect(repository.merge).toHaveBeenCalledWith(entity, updateDto);
    });

    it('should throw RpcException when venue to update not found', async () => {
      repository.findOne.mockResolvedValueOnce(null);
      await expect(service.update(999, { name: 'X' })).rejects.toThrow(
        RpcException,
      );
    });
  });

  describe('remove', () => {
    it('should remove and return the venue', async () => {
      const entity = { ...mockVenue };
      repository.findOne.mockResolvedValueOnce(mockVenue);
      repository.create.mockReturnValueOnce(entity);
      repository.remove.mockResolvedValueOnce(mockVenue);
      const result = await service.remove(1);
      expect(result).toEqual(mockVenue);
      expect(repository.remove).toHaveBeenCalledWith(entity);
    });

    it('should throw RpcException when venue to remove not found', async () => {
      repository.findOne.mockResolvedValueOnce(null);
      await expect(service.remove(999)).rejects.toThrow(RpcException);
    });
  });

  describe('findOneEntity', () => {
    it('should return a venue entity', async () => {
      repository.findOne.mockResolvedValueOnce(mockVenue);
      const result = await service.findOneEntity(1);
      expect(result).toEqual(mockVenue);
    });

    it('should return null when entity not found', async () => {
      repository.findOne.mockResolvedValueOnce(null);
      const result = await service.findOneEntity(999);
      expect(result).toBeNull();
    });
  });
});
