import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { newDb, DataType } from 'pg-mem';
import { EventsModule } from './events.module';
import { EventsService } from './events.service';
import { Event } from './entities/event.entity';
import { EventStatus } from '@app/contracts/events-service';

describe('EventsService (integration)', () => {
  let module: TestingModule;
  let service: EventsService;

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
            entities: [Event],
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
        EventsModule,
      ],
    }).compile();

    service = module.get(EventsService);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should create an event', async () => {
    const result = await service.create({
      title: 'Wedding Reception',
      eventDate: new Date('2026-06-15'),
      startTime: '18:00',
      endTime: '23:00',
      venue: 'Grand Ballroom',
      capacity: 200,
      organizer: 'John Doe',
    });

    expect(result).toBeDefined();
    expect(result.id).toBeDefined();
    expect(result.title).toBe('Wedding Reception');
    expect(result.status).toBe(EventStatus.PLANNED);
  });

  it('should find all events', async () => {
    const results = await service.findAll();
    expect(results.length).toBeGreaterThanOrEqual(1);
  });

  it('should find event by id', async () => {
    const created = await service.create({
      title: 'Conference',
      eventDate: new Date('2026-07-01'),
      startTime: '09:00',
      venue: 'Meeting Room A',
      capacity: 50,
      organizer: 'Jane Smith',
    });

    const found = await service.findOne(created.id);
    expect(found.id).toBe(created.id);
    expect(found.title).toBe('Conference');
  });

  it('should update an event', async () => {
    const created = await service.create({
      title: 'Workshop',
      eventDate: new Date('2026-08-01'),
      startTime: '10:00',
      venue: 'Room B',
      capacity: 30,
      organizer: 'Admin',
    });

    const updated = await service.update(created.id, {
      status: EventStatus.CONFIRMED,
      attendees: 25,
    });

    expect(updated.status).toBe(EventStatus.CONFIRMED);
    expect(updated.attendees).toBe(25);
  });

  it('should remove an event', async () => {
    const created = await service.create({
      title: 'To Remove',
      eventDate: new Date('2026-09-01'),
      startTime: '12:00',
      venue: 'Room C',
      capacity: 10,
      organizer: 'Admin',
    });

    const removed = await service.remove(created.id);
    expect(removed).toBeDefined();
  });
});
