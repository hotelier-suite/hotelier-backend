import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { newDb, DataType } from 'pg-mem';
import { of } from 'rxjs';
import { BookingsModule } from './bookings.module';
import { BookingsService } from './bookings.service';
import { RecreationalBooking } from './entities/recreational-booking.entity';
import { RecreationalFacility } from '../facilities/entities/recreational-facility.entity';
import { FacilitiesModule } from '../facilities/facilities.module';
import { FacilitiesService } from '../facilities/facilities.service';
import { NotificationsService } from '../notifications-service/notifications.service';
import {
  FacilityType,
  RecreationalBookingStatus,
} from '@app/contracts/recreational-service';

describe('BookingsService (integration)', () => {
  let module: TestingModule;
  let service: BookingsService;
  let facilitiesService: FacilitiesService;
  let facilityId: number;

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
            entities: [RecreationalBooking, RecreationalFacility],
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
        FacilitiesModule,
        {
          module: class MockNotifications {},
          global: true,
          providers: [
            {
              provide: NotificationsService,
              useValue: { create: jest.fn().mockReturnValue(of({})) },
            },
          ],
          exports: [NotificationsService],
        },
      ],
    }).compile();

    service = module.get(BookingsService);
    facilitiesService = module.get(FacilitiesService);

    // Seed a facility that's open all week
    const facility = await facilitiesService.create({
      name: 'Test Pool',
      type: FacilityType.SWIMMING_POOL,
      capacity: 50,
      location: 'Ground Floor',
      openingTime: '06:00',
      closingTime: '22:00',
      minimumBookingHours: 1,
      maximumBookingHours: 4,
      availableDays: [0, 1, 2, 3, 4, 5, 6],
      available: true,
    });
    facilityId = facility.id;
  });

  afterAll(async () => {
    await module.close();
  });

  it('should create a booking', async () => {
    const result = await service.create({
      facilityId,
      guestName: 'John Doe',
      guestEmail: 'john@test.com',
      bookingDate: new Date('2026-06-15'), // Monday
      startTime: '10:00',
      endTime: '12:00',
      duration: 2,
      participants: 4,
    });

    expect(result).toBeDefined();
    expect(result.id).toBeDefined();
    expect(result.guestName).toBe('John Doe');
    expect(result.status).toBe(RecreationalBookingStatus.PENDING);
  });

  it('should find all bookings', async () => {
    const results = await service.findAll({});
    expect(results.length).toBeGreaterThanOrEqual(1);
  });

  it('should find booking by id', async () => {
    const created = await service.create({
      facilityId,
      guestName: 'Jane Smith',
      guestEmail: 'jane@test.com',
      bookingDate: new Date('2026-06-16'),
      startTime: '14:00',
      endTime: '16:00',
      duration: 2,
      participants: 2,
    });

    const found = await service.findOne(created.id);
    expect(found.id).toBe(created.id);
  });

  it('should cancel a booking', async () => {
    const created = await service.create({
      facilityId,
      guestName: 'Cancel Test',
      guestEmail: 'cancel@test.com',
      bookingDate: new Date('2026-06-17'),
      startTime: '08:00',
      endTime: '09:00',
      duration: 1,
      participants: 1,
    });

    const cancelled = await service.cancel(created.id, 'Guest requested');
    expect(cancelled.status).toBe(RecreationalBookingStatus.CANCELLED);
  });

  it('should remove a booking', async () => {
    const created = await service.create({
      facilityId,
      guestName: 'Remove Test',
      guestEmail: 'remove@test.com',
      bookingDate: new Date('2026-06-18'),
      startTime: '08:00',
      endTime: '09:00',
      duration: 1,
      participants: 1,
    });

    const removed = await service.remove(created.id);
    expect(removed).toBeDefined();
  });
});
