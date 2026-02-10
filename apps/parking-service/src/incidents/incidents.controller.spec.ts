// Break circular deps: entity files reference each other through barrels
jest.mock('../vehicles/entities/vehicle.entity', () => ({
  Vehicle: class Vehicle {},
}));
jest.mock('../spaces/entities/parking-space.entity', () => ({
  ParkingSpace: class ParkingSpace {},
}));

import { Test, TestingModule } from '@nestjs/testing';
import { IncidentsController } from './incidents.controller';
import { IncidentsService } from './incidents.service';
import { IncidentType, IncidentStatus } from '@app/contracts/parking-service';
import { TaskPriority } from '@app/contracts/common';

describe('IncidentsController', () => {
  let controller: IncidentsController;
  let service: IncidentsService;

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
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IncidentsController],
      providers: [
        {
          provide: IncidentsService,
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

    controller = module.get(IncidentsController);
    service = module.get(IncidentsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return array of incidents', async () => {
      const spy = jest
        .spyOn(service, 'findAll')
        .mockResolvedValueOnce([mockIncident]);
      const result = await controller.findAll({});
      expect(result).toEqual([mockIncident]);
      expect(spy).toHaveBeenCalledWith({});
    });

    it('should pass filters', async () => {
      const filters = { status: IncidentStatus.PENDING };
      const spy = jest
        .spyOn(service, 'findAll')
        .mockResolvedValueOnce([mockIncident]);
      await controller.findAll(filters);
      expect(spy).toHaveBeenCalledWith(filters);
    });
  });

  describe('findOne', () => {
    it('should return a single incident', async () => {
      const spy = jest
        .spyOn(service, 'findOne')
        .mockResolvedValueOnce(mockIncident);
      const result = await controller.findOne(1);
      expect(result).toEqual(mockIncident);
      expect(spy).toHaveBeenCalledWith(1);
    });
  });

  describe('create', () => {
    it('should create and return an incident', async () => {
      const createDto = {
        type: IncidentType.SECURITY,
        description: 'Unauthorized vehicle.',
        responsible: 'Security Guard',
      };
      const created = { ...mockIncident, ...createDto, id: 2 };
      const spy = jest.spyOn(service, 'create').mockResolvedValueOnce(created);
      const result = await controller.create(createDto);
      expect(result).toEqual(created);
      expect(spy).toHaveBeenCalledWith(createDto);
    });
  });

  describe('update', () => {
    it('should update and return the incident', async () => {
      const updateDto = { status: IncidentStatus.RESOLVED };
      const updated = { ...mockIncident, ...updateDto };
      const spy = jest.spyOn(service, 'update').mockResolvedValueOnce(updated);
      const result = await controller.update({ id: 1, data: updateDto });
      expect(result).toEqual(updated);
      expect(spy).toHaveBeenCalledWith(1, updateDto);
    });
  });

  describe('remove', () => {
    it('should remove and return the incident', async () => {
      const spy = jest
        .spyOn(service, 'remove')
        .mockResolvedValueOnce(mockIncident);
      const result = await controller.remove(1);
      expect(result).toEqual(mockIncident);
      expect(spy).toHaveBeenCalledWith(1);
    });
  });
});
