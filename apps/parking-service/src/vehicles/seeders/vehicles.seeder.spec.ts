// Break circular deps: entity files reference each other through barrels
jest.mock('../../spaces/entities/parking-space.entity', () => ({
  ParkingSpace: class ParkingSpace {},
}));
jest.mock('../../incidents/entities/parking-incident.entity', () => ({
  ParkingIncident: class ParkingIncident {},
}));

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { VehiclesSeeder } from './vehicles.seeder';
import { Vehicle } from '../entities';
import { ParkingSpace } from '../../spaces';

describe('VehiclesSeeder', () => {
  let seeder: VehiclesSeeder;
  let vehicleRepo: Record<string, jest.Mock>;
  let spaceRepo: Record<string, jest.Mock>;

  beforeEach(async () => {
    vehicleRepo = { findOne: jest.fn(), save: jest.fn() };
    spaceRepo = { findOne: jest.fn(), save: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VehiclesSeeder,
        { provide: getRepositoryToken(Vehicle), useValue: vehicleRepo },
        { provide: getRepositoryToken(ParkingSpace), useValue: spaceRepo },
      ],
    }).compile();

    seeder = module.get(VehiclesSeeder);
  });

  it('should be defined', () => {
    expect(seeder).toBeDefined();
  });

  it('should seed vehicles when none exist', async () => {
    vehicleRepo.findOne.mockResolvedValue(null);
    vehicleRepo.save.mockResolvedValue({});
    await seeder.seed();
    expect(vehicleRepo.findOne).toHaveBeenCalledTimes(5);
    expect(vehicleRepo.save).toHaveBeenCalledTimes(5);
  });

  it('should skip existing vehicles', async () => {
    vehicleRepo.findOne.mockResolvedValue({ id: 1 });
    await seeder.seed();
    expect(vehicleRepo.save).not.toHaveBeenCalled();
  });
});
