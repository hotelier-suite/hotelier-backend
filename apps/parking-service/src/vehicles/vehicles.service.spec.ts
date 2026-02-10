// Break circular deps: entity files reference each other through barrels
jest.mock('../spaces/entities/parking-space.entity', () => ({
  ParkingSpace: class ParkingSpace {},
}));
jest.mock('../incidents/entities/parking-incident.entity', () => ({
  ParkingIncident: class ParkingIncident {},
}));

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RpcException } from '@nestjs/microservices';
import { VehiclesService } from './vehicles.service';
import { Vehicle } from './entities';
import {
  VehicleType,
  GuestType,
  VehicleStatus,
} from '@app/contracts/parking-service';

describe('VehiclesService', () => {
  let service: VehiclesService;
  let repository: Record<string, jest.Mock>;

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
        VehiclesService,
        { provide: getRepositoryToken(Vehicle), useValue: repository },
      ],
    }).compile();

    service = module.get(VehiclesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all vehicles with filters', async () => {
      repository.find.mockResolvedValueOnce([mockVehicle]);
      const result = await service.findAll({});
      expect(result).toEqual([mockVehicle]);
      expect(repository.find).toHaveBeenCalledWith(
        expect.objectContaining({ order: { createdAt: 'DESC' } }),
      );
    });

    it('should pass filters to find', async () => {
      const filters = { status: VehicleStatus.PARKED };
      repository.find.mockResolvedValueOnce([mockVehicle]);
      await service.findAll(filters);
      expect(repository.find).toHaveBeenCalledWith(
        expect.objectContaining({ where: filters }),
      );
    });
  });

  describe('findOne', () => {
    it('should return a vehicle by id', async () => {
      repository.findOne.mockResolvedValueOnce(mockVehicle);
      const result = await service.findOne(1);
      expect(result).toEqual(mockVehicle);
    });

    it('should throw RpcException when not found', async () => {
      repository.findOne.mockResolvedValueOnce(null);
      await expect(service.findOne(999)).rejects.toThrow(RpcException);
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
      const entity = { ...createDto };
      const saved = { ...mockVehicle, ...createDto, id: 2 };
      repository.create.mockReturnValueOnce(entity);
      repository.save.mockResolvedValueOnce(saved);
      const result = await service.create(createDto);
      expect(result).toEqual(saved);
    });
  });

  describe('update', () => {
    it('should update and return the vehicle', async () => {
      const updateDto = { color: 'Red' };
      const entity = { ...mockVehicle };
      const merged = { ...mockVehicle, ...updateDto };
      repository.findOne.mockResolvedValueOnce(mockVehicle);
      repository.create.mockReturnValueOnce(entity);
      repository.merge.mockReturnValueOnce(merged);
      repository.save.mockResolvedValueOnce(merged);
      const result = await service.update(1, updateDto);
      expect(result).toEqual(merged);
    });

    it('should throw RpcException when vehicle not found', async () => {
      repository.findOne.mockResolvedValueOnce(null);
      await expect(service.update(999, { color: 'Red' })).rejects.toThrow(
        RpcException,
      );
    });
  });

  describe('checkOut', () => {
    it('should set status to EXITED and add exitTime', async () => {
      const entity = { ...mockVehicle };
      const merged = {
        ...mockVehicle,
        status: VehicleStatus.EXITED,
        exitTime: new Date(),
      };
      repository.findOne.mockResolvedValueOnce(mockVehicle);
      repository.create.mockReturnValueOnce(entity);
      repository.merge.mockReturnValueOnce(merged);
      repository.save.mockResolvedValueOnce(merged);
      const result = await service.checkOut(1);
      expect(result.status).toBe(VehicleStatus.EXITED);
    });

    it('should throw RpcException when vehicle not found', async () => {
      repository.findOne.mockResolvedValueOnce(null);
      await expect(service.checkOut(999)).rejects.toThrow(RpcException);
    });
  });

  describe('remove', () => {
    it('should remove and return the vehicle', async () => {
      const entity = { ...mockVehicle };
      repository.findOne.mockResolvedValueOnce(mockVehicle);
      repository.create.mockReturnValueOnce(entity);
      repository.remove.mockResolvedValueOnce(mockVehicle);
      const result = await service.remove(1);
      expect(result).toEqual(mockVehicle);
    });

    it('should throw RpcException when vehicle not found', async () => {
      repository.findOne.mockResolvedValueOnce(null);
      await expect(service.remove(999)).rejects.toThrow(RpcException);
    });
  });
});
