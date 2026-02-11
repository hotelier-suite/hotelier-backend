import { Test, TestingModule } from '@nestjs/testing';
import { FacilitiesController, FacilitiesService } from './';
import {
  RecreationalFacilityDto,
  CreateRecreationalFacilityDto,
  UpdateRecreationalFacilityDto,
  FacilityAvailabilityDto,
  FacilityType,
  FacilityStatus,
  FindFacilitiesFilterDto,
} from '@app/contracts/recreational-service';

describe('FacilitiesController', () => {
  let controller: FacilitiesController;
  let service: FacilitiesService;

  const mockFacility: RecreationalFacilityDto = {
    id: 1,
    name: 'Olympic Pool',
    type: FacilityType.SWIMMING_POOL,
    status: FacilityStatus.AVAILABLE,
    capacity: 25,
    location: 'Ground Floor',
    available: true,
    openingTime: '06:00',
    closingTime: '22:00',
    minimumBookingHours: 1,
    maximumBookingHours: 4,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    getAvailability: jest.fn(),
    getMultipleAvailability: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FacilitiesController],
      providers: [{ provide: FacilitiesService, useValue: mockService }],
    }).compile();

    controller = module.get<FacilitiesController>(FacilitiesController);
    service = module.get<FacilitiesService>(FacilitiesService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all facilities', async () => {
      const filters: FindFacilitiesFilterDto = {};
      const spy = jest
        .spyOn(service, 'findAll')
        .mockResolvedValueOnce([mockFacility]);
      const result = await controller.findAll(filters);
      expect(spy).toHaveBeenCalledWith(filters);
      expect(result).toEqual([mockFacility]);
    });
  });

  describe('findOne', () => {
    it('should return a facility by id', async () => {
      const spy = jest
        .spyOn(service, 'findOne')
        .mockResolvedValueOnce(mockFacility);
      const result = await controller.findOne(1);
      expect(spy).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockFacility);
    });
  });

  describe('create', () => {
    it('should create a facility', async () => {
      const dto: CreateRecreationalFacilityDto = {
        name: 'Olympic Pool',
        type: FacilityType.SWIMMING_POOL,
        capacity: 25,
        location: 'Ground Floor',
        available: true,
        openingTime: '06:00',
        closingTime: '22:00',
        minimumBookingHours: 1,
        maximumBookingHours: 4,
      };
      const spy = jest
        .spyOn(service, 'create')
        .mockResolvedValueOnce(mockFacility);
      const result = await controller.create(dto);
      expect(spy).toHaveBeenCalledWith(dto);
      expect(result).toEqual(mockFacility);
    });
  });

  describe('update', () => {
    it('should update a facility', async () => {
      const data: UpdateRecreationalFacilityDto = { name: 'Updated Pool' };
      const updated = { ...mockFacility, name: 'Updated Pool' };
      const spy = jest.spyOn(service, 'update').mockResolvedValueOnce(updated);
      const result = await controller.update({ id: 1, data });
      expect(spy).toHaveBeenCalledWith(1, data);
      expect(result.name).toBe('Updated Pool');
    });
  });

  describe('remove', () => {
    it('should remove a facility', async () => {
      const spy = jest
        .spyOn(service, 'remove')
        .mockResolvedValueOnce(mockFacility);
      const result = await controller.remove(1);
      expect(spy).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockFacility);
    });
  });

  describe('getAvailability', () => {
    it('should return availability for a facility', async () => {
      const availability: FacilityAvailabilityDto = {
        facilityId: 1,
        facilityName: 'Olympic Pool',
        date: new Date('2024-06-15'),
        isAvailable: true,
        availableSlots: [
          { startTime: '10:00', endTime: '11:00', isAvailable: true },
        ],
      };
      const spy = jest
        .spyOn(service, 'getAvailability')
        .mockResolvedValueOnce(availability);
      const result = await controller.getAvailability({
        facilityId: 1,
        date: new Date('2024-06-15'),
      });
      expect(spy).toHaveBeenCalledWith(1, expect.any(Date));
      expect(result).toEqual(availability);
    });
  });

  describe('getMultipleAvailability', () => {
    it('should return availability for multiple facilities', async () => {
      const availabilities: FacilityAvailabilityDto[] = [
        {
          facilityId: 1,
          facilityName: 'Olympic Pool',
          date: new Date('2024-06-15'),
          isAvailable: true,
          availableSlots: [],
        },
      ];
      const spy = jest
        .spyOn(service, 'getMultipleAvailability')
        .mockResolvedValueOnce(availabilities);
      const result = await controller.getMultipleAvailability({
        facilityIds: [1, 2],
        date: new Date('2024-06-15'),
      });
      expect(spy).toHaveBeenCalledWith([1, 2], expect.any(Date));
      expect(result).toEqual(availabilities);
    });
  });
});
