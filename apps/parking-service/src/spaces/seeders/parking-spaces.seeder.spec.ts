// Break circular deps: entity files reference each other through barrels
jest.mock('../../vehicles/entities/vehicle.entity', () => ({
  Vehicle: class Vehicle {},
}));
jest.mock('../../incidents/entities/parking-incident.entity', () => ({
  ParkingIncident: class ParkingIncident {},
}));

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ParkingSpacesSeeder } from './parking-spaces.seeder';
import { ParkingSpace } from '../entities';

describe('ParkingSpacesSeeder', () => {
  let seeder: ParkingSpacesSeeder;
  let repository: Record<string, jest.Mock>;

  beforeEach(async () => {
    repository = { findOne: jest.fn(), save: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ParkingSpacesSeeder,
        { provide: getRepositoryToken(ParkingSpace), useValue: repository },
      ],
    }).compile();

    seeder = module.get(ParkingSpacesSeeder);
  });

  it('should be defined', () => {
    expect(seeder).toBeDefined();
  });

  it('should seed parking spaces when none exist', async () => {
    repository.findOne.mockResolvedValue(null);
    repository.save.mockResolvedValue({});
    await seeder.seed();
    expect(repository.findOne).toHaveBeenCalledTimes(12);
    expect(repository.save).toHaveBeenCalledTimes(12);
  });

  it('should skip existing parking spaces', async () => {
    repository.findOne.mockResolvedValue({ id: 1 });
    await seeder.seed();
    expect(repository.save).not.toHaveBeenCalled();
  });
});
