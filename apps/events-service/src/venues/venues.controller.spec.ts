// Break circular dependency: venue.entity -> ../../bookings barrel
jest.mock('../bookings', () => ({
  EventBooking: class EventBooking {},
}));

import { Test, TestingModule } from '@nestjs/testing';
import { VenuesController } from './venues.controller';
import { VenuesService } from './venues.service';

describe('VenuesController', () => {
  let controller: VenuesController;
  let service: VenuesService;

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
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VenuesController],
      providers: [
        {
          provide: VenuesService,
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

    controller = module.get(VenuesController);
    service = module.get(VenuesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of venues', async () => {
      const spy = jest
        .spyOn(service, 'findAll')
        .mockResolvedValueOnce([mockVenue]);
      const result = await controller.findAll({});
      expect(result).toEqual([mockVenue]);
      expect(spy).toHaveBeenCalledWith({});
    });

    it('should pass filters to service', async () => {
      const filters = { isAvailable: true, minCapacity: 50 };
      const spy = jest
        .spyOn(service, 'findAll')
        .mockResolvedValueOnce([mockVenue]);
      const result = await controller.findAll(filters);
      expect(result).toEqual([mockVenue]);
      expect(spy).toHaveBeenCalledWith(filters);
    });
  });

  describe('findOne', () => {
    it('should return a single venue', async () => {
      const spy = jest
        .spyOn(service, 'findOne')
        .mockResolvedValueOnce(mockVenue);
      const result = await controller.findOne(1);
      expect(result).toEqual(mockVenue);
      expect(spy).toHaveBeenCalledWith(1);
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
      const created = { ...mockVenue, ...createDto, id: 2 };
      const spy = jest.spyOn(service, 'create').mockResolvedValueOnce(created);
      const result = await controller.create(createDto);
      expect(result).toEqual(created);
      expect(spy).toHaveBeenCalledWith(createDto);
    });
  });

  describe('update', () => {
    it('should update and return the venue', async () => {
      const updateDto = { name: 'Updated Venue' };
      const updated = { ...mockVenue, ...updateDto };
      const spy = jest.spyOn(service, 'update').mockResolvedValueOnce(updated);
      const result = await controller.update({ id: 1, data: updateDto });
      expect(result).toEqual(updated);
      expect(spy).toHaveBeenCalledWith(1, updateDto);
    });
  });

  describe('remove', () => {
    it('should remove and return the venue', async () => {
      const spy = jest
        .spyOn(service, 'remove')
        .mockResolvedValueOnce(mockVenue);
      const result = await controller.remove(1);
      expect(result).toEqual(mockVenue);
      expect(spy).toHaveBeenCalledWith(1);
    });
  });
});
