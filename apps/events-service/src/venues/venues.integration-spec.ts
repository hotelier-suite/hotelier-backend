import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { newDb, DataType } from 'pg-mem';
import { VenuesModule } from './venues.module';
import { VenuesService } from './venues.service';
import { Venue } from './entities/venue.entity';
import { EventBooking } from '../bookings/entities/event-booking.entity';

describe('VenuesService (integration)', () => {
  let module: TestingModule;
  let service: VenuesService;

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
            entities: [Venue, EventBooking],
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
        VenuesModule,
      ],
    }).compile();

    service = module.get(VenuesService);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should create a venue', async () => {
    const result = await service.create({
      name: 'Grand Ballroom',
      capacity: 300,
      area: 500,
      hourlyRate: 150,
      available: true,
      location: 'Floor 1',
    });

    expect(result).toBeDefined();
    expect(result.id).toBeDefined();
    expect(result.name).toBe('Grand Ballroom');
    expect(result.capacity).toBe(300);
  });

  it('should find all venues', async () => {
    const results = await service.findAll();
    expect(results.length).toBeGreaterThanOrEqual(1);
  });

  it('should find venue by id', async () => {
    const created = await service.create({
      name: 'Conference Room A',
      capacity: 50,
      area: 80,
      hourlyRate: 75,
      available: true,
      location: 'Floor 2',
    });

    const found = await service.findOne(created.id);
    expect(found.id).toBe(created.id);
    expect(found.name).toBe('Conference Room A');
  });

  it('should filter venues by availability', async () => {
    await service.create({
      name: 'Unavailable Room',
      capacity: 20,
      area: 30,
      hourlyRate: 50,
      available: false,
      location: 'Floor 3',
    });

    const available = await service.findAll({ isAvailable: true });
    available.forEach((v) => expect(v.available).toBe(true));
  });

  it('should update a venue', async () => {
    const created = await service.create({
      name: 'Room to Update',
      capacity: 40,
      area: 60,
      hourlyRate: 80,
      available: true,
      location: 'Floor 2',
    });

    const updated = await service.update(created.id, { capacity: 60 });
    expect(updated.capacity).toBe(60);
  });

  it('should remove a venue', async () => {
    const created = await service.create({
      name: 'Room to Remove',
      capacity: 10,
      area: 20,
      hourlyRate: 30,
      available: true,
      location: 'Floor 4',
    });

    const removed = await service.remove(created.id);
    expect(removed).toBeDefined();
  });
});
