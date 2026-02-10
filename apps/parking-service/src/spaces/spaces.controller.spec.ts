// Break circular deps: entity files reference each other through barrels
jest.mock('../vehicles/entities/vehicle.entity', () => ({
  Vehicle: class Vehicle {},
}));
jest.mock('../incidents/entities/parking-incident.entity', () => ({
  ParkingIncident: class ParkingIncident {},
}));

import { Test, TestingModule } from '@nestjs/testing';
import { SpacesController } from './spaces.controller';
import { SpacesService } from './spaces.service';
import { SpaceType, SpaceStatus } from '@app/contracts/parking-service';

describe('SpacesController', () => {
  let controller: SpacesController;
  let service: SpacesService;

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
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SpacesController],
      providers: [
        {
          provide: SpacesService,
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

    controller = module.get(SpacesController);
    service = module.get(SpacesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return array of spaces', async () => {
      const spy = jest
        .spyOn(service, 'findAll')
        .mockResolvedValueOnce([mockSpace]);
      const result = await controller.findAll({});
      expect(result).toEqual([mockSpace]);
      expect(spy).toHaveBeenCalledWith({});
    });

    it('should pass filters', async () => {
      const filters = { status: SpaceStatus.AVAILABLE };
      const spy = jest
        .spyOn(service, 'findAll')
        .mockResolvedValueOnce([mockSpace]);
      await controller.findAll(filters);
      expect(spy).toHaveBeenCalledWith(filters);
    });
  });

  describe('findOne', () => {
    it('should return a single space', async () => {
      const spy = jest
        .spyOn(service, 'findOne')
        .mockResolvedValueOnce(mockSpace);
      const result = await controller.findOne(1);
      expect(result).toEqual(mockSpace);
      expect(spy).toHaveBeenCalledWith(1);
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
      const created = { ...mockSpace, ...createDto, id: 2 };
      const spy = jest.spyOn(service, 'create').mockResolvedValueOnce(created);
      const result = await controller.create(createDto);
      expect(result).toEqual(created);
      expect(spy).toHaveBeenCalledWith(createDto);
    });
  });

  describe('update', () => {
    it('should update and return the space', async () => {
      const updateDto = { status: SpaceStatus.OCCUPIED };
      const updated = { ...mockSpace, ...updateDto };
      const spy = jest.spyOn(service, 'update').mockResolvedValueOnce(updated);
      const result = await controller.update({ id: 1, data: updateDto });
      expect(result).toEqual(updated);
      expect(spy).toHaveBeenCalledWith(1, updateDto);
    });
  });

  describe('remove', () => {
    it('should remove and return the space', async () => {
      const spy = jest
        .spyOn(service, 'remove')
        .mockResolvedValueOnce(mockSpace);
      const result = await controller.remove(1);
      expect(result).toEqual(mockSpace);
      expect(spy).toHaveBeenCalledWith(1);
    });
  });
});
