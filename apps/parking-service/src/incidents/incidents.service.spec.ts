// Break circular deps: entity files reference each other through barrels
jest.mock('../vehicles/entities/vehicle.entity', () => ({
  Vehicle: class Vehicle {},
}));
jest.mock('../spaces/entities/parking-space.entity', () => ({
  ParkingSpace: class ParkingSpace {},
}));

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RpcException } from '@nestjs/microservices';
import { IncidentsService } from './incidents.service';
import { ParkingIncident } from './entities';
import { IncidentType, IncidentStatus } from '@app/contracts/parking-service';
import { TaskPriority } from '@app/contracts/common';

describe('IncidentsService', () => {
  let service: IncidentsService;
  let repository: Record<string, jest.Mock>;

  const mockIncident = {
    id: 1,
    type: IncidentType.VEHICLE_DAMAGE,
    description: 'Minor scratch on rear bumper.',
    reportDate: new Date(),
    status: IncidentStatus.PENDING,
    responsible: 'Security Team',
    priority: TaskPriority.NORMAL,
    createdAt: new Date(),
    updatedAt: new Date(),
    vehicleId: 1,
    spaceId: 1,
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
        IncidentsService,
        {
          provide: getRepositoryToken(ParkingIncident),
          useValue: repository,
        },
      ],
    }).compile();

    service = module.get(IncidentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all incidents ordered by reportDate DESC', async () => {
      repository.find.mockResolvedValueOnce([mockIncident]);
      const result = await service.findAll({});
      expect(result).toEqual([mockIncident]);
      expect(repository.find).toHaveBeenCalledWith(
        expect.objectContaining({ order: { reportDate: 'DESC' } }),
      );
    });

    it('should pass filters', async () => {
      const filters = { status: IncidentStatus.PENDING };
      repository.find.mockResolvedValueOnce([mockIncident]);
      await service.findAll(filters);
      expect(repository.find).toHaveBeenCalledWith(
        expect.objectContaining({ where: filters }),
      );
    });
  });

  describe('findOne', () => {
    it('should return an incident by id', async () => {
      repository.findOne.mockResolvedValueOnce(mockIncident);
      const result = await service.findOne(1);
      expect(result).toEqual(mockIncident);
    });

    it('should throw RpcException when not found', async () => {
      repository.findOne.mockResolvedValueOnce(null);
      await expect(service.findOne(999)).rejects.toThrow(RpcException);
    });
  });

  describe('create', () => {
    it('should create and return an incident', async () => {
      const createDto = {
        type: IncidentType.SECURITY,
        description: 'Unauthorized vehicle.',
        responsible: 'Security Guard',
      };
      const entity = { ...createDto };
      const saved = { ...mockIncident, ...createDto, id: 2 };
      repository.create.mockReturnValueOnce(entity);
      repository.save.mockResolvedValueOnce(saved);
      const result = await service.create(createDto);
      expect(result).toEqual(saved);
    });
  });

  describe('update', () => {
    it('should update and return the incident', async () => {
      const updateDto = {
        status: IncidentStatus.RESOLVED,
        resolution: 'Issue resolved.',
      };
      const entity = { ...mockIncident };
      const merged = { ...mockIncident, ...updateDto };
      repository.findOne.mockResolvedValueOnce(mockIncident);
      repository.create.mockReturnValueOnce(entity);
      repository.merge.mockReturnValueOnce(merged);
      repository.save.mockResolvedValueOnce(merged);
      const result = await service.update(1, updateDto);
      expect(result).toEqual(merged);
    });

    it('should throw RpcException when incident not found', async () => {
      repository.findOne.mockResolvedValueOnce(null);
      await expect(
        service.update(999, { status: IncidentStatus.RESOLVED }),
      ).rejects.toThrow(RpcException);
    });
  });

  describe('remove', () => {
    it('should remove and return the incident', async () => {
      const entity = { ...mockIncident };
      repository.findOne.mockResolvedValueOnce(mockIncident);
      repository.create.mockReturnValueOnce(entity);
      repository.remove.mockResolvedValueOnce(mockIncident);
      const result = await service.remove(1);
      expect(result).toEqual(mockIncident);
    });

    it('should throw RpcException when incident not found', async () => {
      repository.findOne.mockResolvedValueOnce(null);
      await expect(service.remove(999)).rejects.toThrow(RpcException);
    });
  });
});
