import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { newDb, DataType } from 'pg-mem';
import { VehiclesModule } from './vehicles.module';
import { VehiclesService } from './vehicles.service';
import { Vehicle } from './entities/vehicle.entity';
import { ParkingSpace } from '../spaces/entities/parking-space.entity';
import { ParkingIncident } from '../incidents/entities/parking-incident.entity';
import {
  VehicleType,
  VehicleStatus,
  GuestType,
} from '@app/contracts/parking-service';

describe('VehiclesService (integration)', () => {
  let module: TestingModule;
  let service: VehiclesService;

  beforeAll(async () => {
    const db = newDb({ autoCreateForeignKeyIndices: true });
    db.public.registerFunction({
      name: 'current_database',
      returns: DataType.text,
      implementation: () => 'test',
    });
    db.public.registerFunction({
      name: 'version',
      returns: DataType.text,
      implementation: () => 'PostgreSQL 18.0 (pg-mem)',
    });

    module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRootAsync({
          useFactory: (): TypeOrmModuleOptions => ({
            type: 'postgres',
            entities: [Vehicle, ParkingSpace, ParkingIncident],
          }),
          dataSourceFactory: async (options) => {
            const ds = db.adapters.createTypeormDataSource(
              options,
            ) as DataSource;
            await ds.initialize();
            await ds.synchronize();
            return ds;
          },
        }),
        VehiclesModule,
      ],
    }).compile();

    service = module.get(VehiclesService);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should create a vehicle', async () => {
    const result = await service.create({
      licensePlate: 'ABC-123',
      brand: 'Toyota',
      model: 'Camry',
      color: 'White',
      type: VehicleType.CAR,
      owner: 'John Doe',
      guestType: GuestType.GUEST,
      room: '101',
    });

    expect(result).toBeDefined();
    expect(result.id).toBeDefined();
    expect(result.licensePlate).toBe('ABC-123');
    expect(result.status).toBe(VehicleStatus.PARKED);
  });

  it('should find all vehicles', async () => {
    const results = await service.findAll({});
    expect(results.length).toBeGreaterThanOrEqual(1);
  });

  it('should find vehicle by id', async () => {
    const created = await service.create({
      licensePlate: 'DEF-456',
      brand: 'Honda',
      model: 'Civic',
      color: 'Black',
      type: VehicleType.CAR,
      owner: 'Jane Smith',
      guestType: GuestType.VISITOR,
    });

    const found = await service.findOne(created.id);
    expect(found.id).toBe(created.id);
    expect(found.brand).toBe('Honda');
  });

  it('should check out a vehicle', async () => {
    const created = await service.create({
      licensePlate: 'GHI-789',
      brand: 'BMW',
      model: 'X5',
      color: 'Silver',
      type: VehicleType.CAR,
      owner: 'Bob',
      guestType: GuestType.GUEST,
    });

    const checkedOut = await service.checkOut(created.id);
    expect(checkedOut.status).toBe(VehicleStatus.EXITED);
    expect(checkedOut.exitTime).toBeDefined();
  });

  it('should filter vehicles by status', async () => {
    const results = await service.findAll({
      status: VehicleStatus.PARKED,
    });
    results.forEach((v) => expect(v.status).toBe(VehicleStatus.PARKED));
  });

  it('should remove a vehicle', async () => {
    const created = await service.create({
      licensePlate: 'JKL-012',
      brand: 'Ford',
      model: 'Focus',
      color: 'Red',
      type: VehicleType.CAR,
      owner: 'Charlie',
      guestType: GuestType.EMPLOYEE,
    });

    const removed = await service.remove(created.id);
    expect(removed).toBeDefined();
  });
});
