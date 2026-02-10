import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RpcException } from '@nestjs/microservices';
import { EventsService } from './events.service';
import { Event } from './entities';
import { EventStatus } from '@app/contracts/events-service';

describe('EventsService', () => {
  let service: EventsService;
  let repository: Record<string, jest.Mock>;

  const mockEvent = {
    id: 1,
    title: 'Annual Corporate Retreat',
    description: 'Corporate retreat focused on team building.',
    eventDate: new Date('2024-12-15'),
    startTime: '09:00',
    endTime: '17:00',
    venue: 'Alpha Conference Room',
    capacity: 50,
    attendees: 45,
    status: EventStatus.CONFIRMED,
    organizer: 'Advanced Technology Corp.',
    cost: 1200.0,
    revenue: 2500.0,
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
        EventsService,
        { provide: getRepositoryToken(Event), useValue: repository },
      ],
    }).compile();

    service = module.get(EventsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all events ordered by eventDate ASC', async () => {
      repository.find.mockResolvedValueOnce([mockEvent]);
      const result = await service.findAll();
      expect(result).toEqual([mockEvent]);
      expect(repository.find).toHaveBeenCalledWith(
        expect.objectContaining({ order: { eventDate: 'ASC' } }),
      );
    });

    it('should return empty array when no events', async () => {
      repository.find.mockResolvedValueOnce([]);
      const result = await service.findAll();
      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a single event by id', async () => {
      repository.findOne.mockResolvedValueOnce(mockEvent);
      const result = await service.findOne(1);
      expect(result).toEqual(mockEvent);
      expect(repository.findOne).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: 1 } }),
      );
    });

    it('should throw RpcException when event not found', async () => {
      repository.findOne.mockResolvedValueOnce(null);
      await expect(service.findOne(999)).rejects.toThrow(RpcException);
    });
  });

  describe('create', () => {
    it('should create and return a new event', async () => {
      const createDto = {
        title: 'New Event',
        eventDate: new Date('2024-12-20'),
        startTime: '10:00',
        venue: 'Grand Ballroom',
        capacity: 100,
        organizer: 'Test Corp.',
      };
      const entity = { ...createDto };
      const saved = { ...mockEvent, ...createDto, id: 2 };
      repository.create.mockReturnValueOnce(entity);
      repository.save.mockResolvedValueOnce(saved);
      const result = await service.create(createDto);
      expect(result).toEqual(saved);
      expect(repository.create).toHaveBeenCalledWith(createDto);
      expect(repository.save).toHaveBeenCalledWith(entity);
    });
  });

  describe('update', () => {
    it('should update and return the event', async () => {
      const updateDto = { title: 'Updated Event' };
      const entity = { ...mockEvent };
      const merged = { ...mockEvent, ...updateDto };
      repository.findOne.mockResolvedValueOnce(mockEvent);
      repository.create.mockReturnValueOnce(entity);
      repository.merge.mockReturnValueOnce(merged);
      repository.save.mockResolvedValueOnce(merged);
      const result = await service.update(1, updateDto);
      expect(result).toEqual(merged);
      expect(repository.merge).toHaveBeenCalledWith(entity, updateDto);
    });

    it('should throw RpcException when event to update not found', async () => {
      repository.findOne.mockResolvedValueOnce(null);
      await expect(service.update(999, { title: 'X' })).rejects.toThrow(
        RpcException,
      );
    });
  });

  describe('remove', () => {
    it('should remove and return the event', async () => {
      const entity = { ...mockEvent };
      repository.findOne.mockResolvedValueOnce(mockEvent);
      repository.create.mockReturnValueOnce(entity);
      repository.remove.mockResolvedValueOnce(mockEvent);
      const result = await service.remove(1);
      expect(result).toEqual(mockEvent);
      expect(repository.remove).toHaveBeenCalledWith(entity);
    });

    it('should throw RpcException when event to remove not found', async () => {
      repository.findOne.mockResolvedValueOnce(null);
      await expect(service.remove(999)).rejects.toThrow(RpcException);
    });
  });
});
