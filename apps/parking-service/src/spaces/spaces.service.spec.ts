// Break circular deps: entity files reference each other through barrels
jest.mock('../vehicles/entities/vehicle.entity', () => ({
  Vehicle: class Vehicle {},
}));
jest.mock('../incidents/entities/parking-incident.entity', () => ({
  ParkingIncident: class ParkingIncident {},
}));

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RpcException } from '@nestjs/microservices';
import { SpacesService } from './spaces.service';
import { ParkingSpace } from './entities';
import { SpaceType, SpaceStatus } from '@app/contracts/parking-service';

describe('SpacesService', () => {
  let service: SpacesService;
  let repository: Record<string, jest.Mock>;

  const mockSpace = {
    id: 1,
    code: 'G-001',
    zone: 'Ground Floor',
    type: SpaceType.GUEST,
    status: SpaceStatus.AVAILABLE,
    hourlyRate: 5.0,
    location: 'Ground Floor - Row A',
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
        SpacesService,
        { provide: getRepositoryToken(ParkingSpace), useValue: repository },
      ],
    }).compile();

    service = module.get(SpacesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all spaces ordered by code', async () => {
      repository.find.mockResolvedValueOnce([mockSpace]);
      const result = await service.findAll({});
      expect(result).toEqual([mockSpace]);
      expect(repository.find).toHaveBeenCalledWith(
        expect.objectContaining({ order: { code: 'ASC' } }),
      );
    });

    it('should pass filters to find', async () => {
      const filters = { status: SpaceStatus.AVAILABLE };
      repository.find.mockResolvedValueOnce([mockSpace]);
      await service.findAll(filters);
      expect(repository.find).toHaveBeenCalledWith(
        expect.objectContaining({ where: filters }),
      );
    });
  });

  describe('findOne', () => {
    it('should return a space by id', async () => {
      repository.findOne.mockResolvedValueOnce(mockSpace);
      const result = await service.findOne(1);
      expect(result).toEqual(mockSpace);
    });

    it('should throw RpcException when not found', async () => {
      repository.findOne.mockResolvedValueOnce(null);
      await expect(service.findOne(999)).rejects.toThrow(RpcException);
    });
  });

  describe('create', () => {
    it('should create and return a space', async () => {
      const createDto = {
        code: 'G-010',
        zone: 'Ground Floor',
        type: SpaceType.GUEST,
        hourlyRate: 5.0,
        location: 'Ground Floor - Row C',
      };
      const entity = { ...createDto };
      const saved = { ...mockSpace, ...createDto, id: 2 };
      repository.create.mockReturnValueOnce(entity);
      repository.save.mockResolvedValueOnce(saved);
      const result = await service.create(createDto);
      expect(result).toEqual(saved);
    });
  });

  describe('update', () => {
    it('should update and return the space', async () => {
      const updateDto = { status: SpaceStatus.OCCUPIED };
      const entity = { ...mockSpace };
      const merged = { ...mockSpace, ...updateDto };
      repository.findOne.mockResolvedValueOnce(mockSpace);
      repository.create.mockReturnValueOnce(entity);
      repository.merge.mockReturnValueOnce(merged);
      repository.save.mockResolvedValueOnce(merged);
      const result = await service.update(1, updateDto);
      expect(result).toEqual(merged);
    });

    it('should throw RpcException when space not found', async () => {
      repository.findOne.mockResolvedValueOnce(null);
      await expect(
        service.update(999, { status: SpaceStatus.OCCUPIED }),
      ).rejects.toThrow(RpcException);
    });
  });

  describe('remove', () => {
    it('should remove and return the space', async () => {
      const entity = { ...mockSpace };
      repository.findOne.mockResolvedValueOnce(mockSpace);
      repository.create.mockReturnValueOnce(entity);
      repository.remove.mockResolvedValueOnce(mockSpace);
      const result = await service.remove(1);
      expect(result).toEqual(mockSpace);
    });

    it('should throw RpcException when space not found', async () => {
      repository.findOne.mockResolvedValueOnce(null);
      await expect(service.remove(999)).rejects.toThrow(RpcException);
    });
  });
});
