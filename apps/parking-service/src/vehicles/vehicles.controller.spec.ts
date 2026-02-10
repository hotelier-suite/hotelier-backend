// Break circular deps: entity files reference each other through barrels
jest.mock('../spaces/entities/parking-space.entity', () => ({
  ParkingSpace: class ParkingSpace {},
}));
jest.mock('../incidents/entities/parking-incident.entity', () => ({
  ParkingIncident: class ParkingIncident {},
}));

import { Test, TestingModule } from '@nestjs/testing';
import { VehiclesController } from './vehicles.controller';
import { VehiclesService } from './vehicles.service';
import {
  VehicleType,
  GuestType,
  VehicleStatus,
} from '@app/contracts/parking-service';

describe('VehiclesController', () => {
  let controller: VehiclesController;
  let service: VehiclesService;

  const mockVehicle = {
    id: 1,
    licensePlate: 'ABC-123',
    brand: 'Toyota',
    model: 'Camry',
    color: 'Blue',
    type: VehicleType.CAR,
    owner: 'John Smith',
    room: '201',
    guestType: GuestType.GUEST,
    assignedSpace: 'G-002',
    entryTime: new Date(),
    status: VehicleStatus.PARKED,
    notes: 'Guest vehicle',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VehiclesController],
      providers: [
        {
          provide: VehiclesService,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            checkOut: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get(VehiclesController);
    service = module.get(VehiclesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return array of vehicles', async () => {
      const spy = jest
        .spyOn(service, 'findAll')
        .mockResolvedValueOnce([mockVehicle]);
      const result = await controller.findAll({});
      expect(result).toEqual([mockVehicle]);
      expect(spy).toHaveBeenCalledWith({});
    });

    it('should pass filters to service', async () => {
      const filters = { status: VehicleStatus.PARKED };
      const spy = jest
        .spyOn(service, 'findAll')
        .mockResolvedValueOnce([mockVehicle]);
      const result = await controller.findAll(filters);
      expect(result).toEqual([mockVehicle]);
      expect(spy).toHaveBeenCalledWith(filters);
    });
  });

  describe('findOne', () => {
    it('should return a single vehicle', async () => {
      const spy = jest
        .spyOn(service, 'findOne')
        .mockResolvedValueOnce(mockVehicle);
      const result = await controller.findOne(1);
      expect(result).toEqual(mockVehicle);
      expect(spy).toHaveBeenCalledWith(1);
    });
  });

  describe('create', () => {
    it('should create and return a vehicle', async () => {
      const createDto = {
        licensePlate: 'NEW-001',
        brand: 'Honda',
        model: 'Civic',
        color: 'White',
        type: VehicleType.CAR,
        owner: 'Jane Doe',
        guestType: GuestType.GUEST,
      };
      const created = { ...mockVehicle, ...createDto, id: 2 };
      const spy = jest.spyOn(service, 'create').mockResolvedValueOnce(created);
      const result = await controller.create(createDto);
      expect(result).toEqual(created);
      expect(spy).toHaveBeenCalledWith(createDto);
    });
  });

  describe('update', () => {
    it('should update and return the vehicle', async () => {
      const updateDto = { color: 'Red' };
      const updated = { ...mockVehicle, ...updateDto };
      const spy = jest.spyOn(service, 'update').mockResolvedValueOnce(updated);
      const result = await controller.update({ id: 1, data: updateDto });
      expect(result).toEqual(updated);
      expect(spy).toHaveBeenCalledWith(1, updateDto);
    });
  });

  describe('checkOut', () => {
    it('should check out a vehicle', async () => {
      const checkedOut = {
        ...mockVehicle,
        status: VehicleStatus.EXITED,
        exitTime: new Date(),
      };
      const spy = jest
        .spyOn(service, 'checkOut')
        .mockResolvedValueOnce(checkedOut);
      const result = await controller.checkOut(1);
      expect(result).toEqual(checkedOut);
      expect(spy).toHaveBeenCalledWith(1);
    });
  });

  describe('remove', () => {
    it('should remove and return the vehicle', async () => {
      const spy = jest
        .spyOn(service, 'remove')
        .mockResolvedValueOnce(mockVehicle);
      const result = await controller.remove(1);
      expect(result).toEqual(mockVehicle);
      expect(spy).toHaveBeenCalledWith(1);
    });
  });
});
