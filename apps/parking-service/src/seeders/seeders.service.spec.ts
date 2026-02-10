// Break circular deps: entity files reference each other through barrels
jest.mock('../vehicles/entities/vehicle.entity', () => ({
  Vehicle: class Vehicle {},
}));
jest.mock('../spaces/entities/parking-space.entity', () => ({
  ParkingSpace: class ParkingSpace {},
}));
jest.mock('../incidents/entities/parking-incident.entity', () => ({
  ParkingIncident: class ParkingIncident {},
}));

import { Test, TestingModule } from '@nestjs/testing';
import { SeedersService } from './seeders.service';
import { VehiclesSeeder } from '../vehicles';
import { ParkingSpacesSeeder } from '../spaces';
import { ParkingIncidentsSeeder } from '../incidents';

describe('SeedersService', () => {
  let service: SeedersService;
  let spacesSeeder: ParkingSpacesSeeder;
  let vehiclesSeeder: VehiclesSeeder;
  let incidentsSeeder: ParkingIncidentsSeeder;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SeedersService,
        { provide: ParkingSpacesSeeder, useValue: { seed: jest.fn() } },
        { provide: VehiclesSeeder, useValue: { seed: jest.fn() } },
        { provide: ParkingIncidentsSeeder, useValue: { seed: jest.fn() } },
      ],
    }).compile();

    service = module.get(SeedersService);
    spacesSeeder = module.get(ParkingSpacesSeeder);
    vehiclesSeeder = module.get(VehiclesSeeder);
    incidentsSeeder = module.get(ParkingIncidentsSeeder);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call all seeders', async () => {
    const spacesSpy = jest
      .spyOn(spacesSeeder, 'seed')
      .mockResolvedValueOnce(undefined);
    const vehiclesSpy = jest
      .spyOn(vehiclesSeeder, 'seed')
      .mockResolvedValueOnce(undefined);
    const incidentsSpy = jest
      .spyOn(incidentsSeeder, 'seed')
      .mockResolvedValueOnce(undefined);

    await service.seed();

    expect(spacesSpy).toHaveBeenCalled();
    expect(vehiclesSpy).toHaveBeenCalled();
    expect(incidentsSpy).toHaveBeenCalled();
  });

  it('should seed in correct order', async () => {
    const callOrder: string[] = [];

    jest.spyOn(spacesSeeder, 'seed').mockImplementation(() => {
      callOrder.push('spaces');
      return Promise.resolve();
    });
    jest.spyOn(vehiclesSeeder, 'seed').mockImplementation(() => {
      callOrder.push('vehicles');
      return Promise.resolve();
    });
    jest.spyOn(incidentsSeeder, 'seed').mockImplementation(() => {
      callOrder.push('incidents');
      return Promise.resolve();
    });

    await service.seed();

    expect(callOrder).toEqual(['spaces', 'vehicles', 'incidents']);
  });
});
