// Break circular deps: entity files reference each other through barrels
jest.mock('../../vehicles/entities/vehicle.entity', () => ({
  Vehicle: class Vehicle {},
}));
jest.mock('../../spaces/entities/parking-space.entity', () => ({
  ParkingSpace: class ParkingSpace {},
}));

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ParkingIncidentsSeeder } from './parking-incidents.seeder';
import { ParkingIncident } from '../entities';
import { Vehicle } from '../../vehicles';
import { ParkingSpace } from '../../spaces';

describe('ParkingIncidentsSeeder', () => {
  let seeder: ParkingIncidentsSeeder;
  let incidentRepo: Record<string, jest.Mock>;
  let vehicleRepo: Record<string, jest.Mock>;
  let spaceRepo: Record<string, jest.Mock>;

  beforeEach(async () => {
    incidentRepo = { findOne: jest.fn(), save: jest.fn() };
    vehicleRepo = { find: jest.fn() };
    spaceRepo = { find: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ParkingIncidentsSeeder,
        {
          provide: getRepositoryToken(ParkingIncident),
          useValue: incidentRepo,
        },
        { provide: getRepositoryToken(Vehicle), useValue: vehicleRepo },
        { provide: getRepositoryToken(ParkingSpace), useValue: spaceRepo },
      ],
    }).compile();

    seeder = module.get(ParkingIncidentsSeeder);
  });

  it('should be defined', () => {
    expect(seeder).toBeDefined();
  });

  it('should seed incidents when none exist', async () => {
    vehicleRepo.find.mockResolvedValueOnce([{ id: 1 }, { id: 2 }, { id: 3 }]);
    spaceRepo.find.mockResolvedValueOnce([{ id: 1 }, { id: 2 }, { id: 3 }]);
    incidentRepo.findOne.mockResolvedValue(null);
    incidentRepo.save.mockResolvedValue({});

    await seeder.seed();

    expect(incidentRepo.findOne).toHaveBeenCalledTimes(5);
    expect(incidentRepo.save).toHaveBeenCalledTimes(5);
  });

  it('should skip existing incidents', async () => {
    vehicleRepo.find.mockResolvedValueOnce([{ id: 1 }]);
    spaceRepo.find.mockResolvedValueOnce([{ id: 1 }]);
    incidentRepo.findOne.mockResolvedValue({ id: 1 });

    await seeder.seed();

    expect(incidentRepo.save).not.toHaveBeenCalled();
  });
});
