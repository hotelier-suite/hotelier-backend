import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { newDb, DataType } from 'pg-mem';
import { SpacesModule } from './spaces.module';
import { SpacesService } from './spaces.service';
import { ParkingSpace } from './entities/parking-space.entity';
import { Vehicle } from '../vehicles/entities/vehicle.entity';
import { ParkingIncident } from '../incidents/entities/parking-incident.entity';
import { SpaceType, SpaceStatus } from '@app/contracts/parking-service';

describe('SpacesService (integration)', () => {
  let module: TestingModule;
  let service: SpacesService;

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
            entities: [ParkingSpace, Vehicle, ParkingIncident],
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
        SpacesModule,
      ],
    }).compile();

    service = module.get(SpacesService);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should create a parking space', async () => {
    const result = await service.create({
      code: 'A-001',
      zone: 'Zone A',
      type: SpaceType.GUEST,
      hourlyRate: 5.0,
      location: 'Ground Floor',
    });

    expect(result).toBeDefined();
    expect(result.id).toBeDefined();
    expect(result.code).toBe('A-001');
    expect(result.status).toBe(SpaceStatus.AVAILABLE);
  });

  it('should find all spaces', async () => {
    const results = await service.findAll({});
    expect(results.length).toBeGreaterThanOrEqual(1);
  });

  it('should find space by id', async () => {
    const created = await service.create({
      code: 'B-001',
      zone: 'Zone B',
      type: SpaceType.VIP,
      hourlyRate: 15.0,
      location: 'Underground',
    });

    const found = await service.findOne(created.id);
    expect(found.id).toBe(created.id);
    expect(found.type).toBe(SpaceType.VIP);
  });

  it('should filter spaces by status', async () => {
    const results = await service.findAll({
      status: SpaceStatus.AVAILABLE,
    });
    results.forEach((s) => expect(s.status).toBe(SpaceStatus.AVAILABLE));
  });

  it('should update a parking space', async () => {
    const created = await service.create({
      code: 'C-001',
      zone: 'Zone C',
      type: SpaceType.EMPLOYEE,
      hourlyRate: 3.0,
      location: 'Level 2',
    });

    const updated = await service.update(created.id, {
      status: SpaceStatus.MAINTENANCE,
    });
    expect(updated.status).toBe(SpaceStatus.MAINTENANCE);
  });

  it('should remove a parking space', async () => {
    const created = await service.create({
      code: 'D-001',
      zone: 'Zone D',
      type: SpaceType.LOADING,
      hourlyRate: 0,
      location: 'Back Entrance',
    });

    const removed = await service.remove(created.id);
    expect(removed).toBeDefined();
  });
});
