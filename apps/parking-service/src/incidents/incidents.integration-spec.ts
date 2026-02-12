import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { newDb, DataType } from 'pg-mem';
import { IncidentsModule } from './incidents.module';
import { IncidentsService } from './incidents.service';
import { ParkingIncident } from './entities/parking-incident.entity';
import { Vehicle } from '../vehicles/entities/vehicle.entity';
import { ParkingSpace } from '../spaces/entities/parking-space.entity';
import { IncidentType, IncidentStatus } from '@app/contracts/parking-service';
import { TaskPriority } from '@app/contracts/common';

describe('IncidentsService (integration)', () => {
  let module: TestingModule;
  let service: IncidentsService;

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
            entities: [ParkingIncident, Vehicle, ParkingSpace],
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
        IncidentsModule,
      ],
    }).compile();

    service = module.get(IncidentsService);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should create an incident', async () => {
    const result = await service.create({
      type: IncidentType.VEHICLE_DAMAGE,
      description: 'Scratch on driver side door',
      responsible: 'Valet Staff',
      priority: TaskPriority.HIGH,
    });

    expect(result).toBeDefined();
    expect(result.id).toBeDefined();
    expect(result.type).toBe(IncidentType.VEHICLE_DAMAGE);
    expect(result.status).toBe(IncidentStatus.PENDING);
  });

  it('should find all incidents', async () => {
    const results = await service.findAll({});
    expect(results.length).toBeGreaterThanOrEqual(1);
  });

  it('should find incident by id', async () => {
    const created = await service.create({
      type: IncidentType.SECURITY,
      description: 'Unauthorized access attempt',
      responsible: 'Security Team',
    });

    const found = await service.findOne(created.id);
    expect(found.id).toBe(created.id);
    expect(found.type).toBe(IncidentType.SECURITY);
  });

  it('should update incident status', async () => {
    const created = await service.create({
      type: IncidentType.INFRASTRUCTURE,
      description: 'Broken barrier',
      responsible: 'Maintenance',
    });

    const updated = await service.update(created.id, {
      status: IncidentStatus.IN_PROGRESS,
      resolution: 'Repair scheduled',
    });
    expect(updated.status).toBe(IncidentStatus.IN_PROGRESS);
  });

  it('should filter incidents by status', async () => {
    const results = await service.findAll({
      status: IncidentStatus.PENDING,
    });
    results.forEach((i) => expect(i.status).toBe(IncidentStatus.PENDING));
  });

  it('should remove an incident', async () => {
    const created = await service.create({
      type: IncidentType.OTHER,
      description: 'To remove',
      responsible: 'Admin',
    });

    const removed = await service.remove(created.id);
    expect(removed).toBeDefined();
  });
});
