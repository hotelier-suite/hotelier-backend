import { Test, TestingModule } from '@nestjs/testing';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { EventStatus } from '@app/contracts/events-service';

describe('EventsController', () => {
  let controller: EventsController;
  let service: EventsService;

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
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventsController],
      providers: [
        {
          provide: EventsService,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get(EventsController);
    service = module.get(EventsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of events', async () => {
      const spy = jest
        .spyOn(service, 'findAll')
        .mockResolvedValueOnce([mockEvent]);
      const result = await controller.findAll();
      expect(result).toEqual([mockEvent]);
      expect(spy).toHaveBeenCalled();
    });

    it('should return empty array when no events', async () => {
      jest.spyOn(service, 'findAll').mockResolvedValueOnce([]);
      const result = await controller.findAll();
      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a single event', async () => {
      const spy = jest
        .spyOn(service, 'findOne')
        .mockResolvedValueOnce(mockEvent);
      const result = await controller.findOne(1);
      expect(result).toEqual(mockEvent);
      expect(spy).toHaveBeenCalledWith(1);
    });
  });

  describe('create', () => {
    it('should create and return a new event', async () => {
      const createDto = {
        title: 'New Event',
        eventDate: new Date('2024-12-20'),
        startTime: '10:00',
        endTime: '14:00',
        venue: 'Grand Ballroom',
        capacity: 100,
        organizer: 'Test Corp.',
      };
      const created = { ...mockEvent, ...createDto, id: 2 };
      const spy = jest.spyOn(service, 'create').mockResolvedValueOnce(created);
      const result = await controller.create(createDto);
      expect(result).toEqual(created);
      expect(spy).toHaveBeenCalledWith(createDto);
    });
  });

  describe('update', () => {
    it('should update and return the event', async () => {
      const updateDto = { title: 'Updated Event' };
      const updated = { ...mockEvent, ...updateDto };
      const spy = jest.spyOn(service, 'update').mockResolvedValueOnce(updated);
      const result = await controller.update({ id: 1, data: updateDto });
      expect(result).toEqual(updated);
      expect(spy).toHaveBeenCalledWith(1, updateDto);
    });
  });

  describe('remove', () => {
    it('should remove and return the event', async () => {
      const spy = jest
        .spyOn(service, 'remove')
        .mockResolvedValueOnce(mockEvent);
      const result = await controller.remove(1);
      expect(result).toEqual(mockEvent);
      expect(spy).toHaveBeenCalledWith(1);
    });
  });
});
