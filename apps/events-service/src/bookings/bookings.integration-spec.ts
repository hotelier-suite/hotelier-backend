import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { newDb, DataType } from 'pg-mem';
import { BookingsModule } from './bookings.module';
import { BookingsService } from './bookings.service';
import { EventBooking } from './entities/event-booking.entity';
import { Venue } from '../venues/entities/venue.entity';
import { VenuesModule } from '../venues/venues.module';
import { VenuesService } from '../venues/venues.service';
import { EventStatus } from '@app/contracts/events-service';

describe('BookingsService (integration)', () => {
  let module: TestingModule;
  let service: BookingsService;
  let venuesService: VenuesService;
  let venueId: number;

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
            entities: [EventBooking, Venue],
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
        BookingsModule,
        VenuesModule,
      ],
    }).compile();

    service = module.get(BookingsService);
    venuesService = module.get(VenuesService);

    const venue = await venuesService.create({
      name: 'Test Venue',
      capacity: 100,
      area: 200,
      hourlyRate: 100,
      available: true,
      location: 'Floor 1',
    });
    venueId = venue.id;
  });

  afterAll(async () => {
    await module.close();
  });

  it('should create a booking with calculated cost', async () => {
    const result = await service.create({
      title: 'Birthday Party',
      eventDate: new Date('2026-06-20'),
      startTime: '18:00',
      endTime: '22:00',
      attendees: 50,
      clientName: 'Alice',
      clientEmail: 'alice@test.com',
      venueId,
    });

    expect(result).toBeDefined();
    expect(result.id).toBeDefined();
    expect(result.title).toBe('Birthday Party');
    expect(result.totalCost).toBe(400); // 4 hours * $100/hr
    expect(result.status).toBe(EventStatus.PLANNED);
  });

  it('should find all bookings', async () => {
    const results = await service.findAll({});
    expect(results.length).toBeGreaterThanOrEqual(1);
  });

  it('should find booking by id', async () => {
    const created = await service.create({
      title: 'Meeting',
      eventDate: new Date('2026-07-10'),
      startTime: '09:00',
      endTime: '11:00',
      attendees: 20,
      clientName: 'Bob',
      clientEmail: 'bob@test.com',
      venueId,
    });

    const found = await service.findOne(created.id);
    expect(found.id).toBe(created.id);
    expect(found.totalCost).toBe(200); // 2 hours * $100/hr
  });

  it('should update a booking', async () => {
    const created = await service.create({
      title: 'Workshop',
      eventDate: new Date('2026-08-05'),
      startTime: '10:00',
      endTime: '12:00',
      attendees: 15,
      clientName: 'Charlie',
      clientEmail: 'charlie@test.com',
      venueId,
    });

    const updated = await service.update(created.id, {
      status: EventStatus.CONFIRMED,
    });
    expect(updated.status).toBe(EventStatus.CONFIRMED);
  });

  it('should remove a booking', async () => {
    const created = await service.create({
      title: 'To Remove',
      eventDate: new Date('2026-09-01'),
      startTime: '14:00',
      endTime: '16:00',
      attendees: 10,
      clientName: 'Dave',
      clientEmail: 'dave@test.com',
      venueId,
    });

    const removed = await service.remove(created.id);
    expect(removed).toBeDefined();
  });
});
