import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { newDb, DataType } from 'pg-mem';
import { of } from 'rxjs';
import { FacilitiesModule } from './facilities.module';
import { FacilitiesService } from './facilities.service';
import { RecreationalFacility } from './entities/recreational-facility.entity';
import { RecreationalBooking } from '../bookings/entities/recreational-booking.entity';
import { NotificationsService } from '../notifications-service/notifications.service';
import {
  FacilityType,
  FacilityStatus,
} from '@app/contracts/recreational-service';

describe('FacilitiesService (integration)', () => {
  let module: TestingModule;
  let service: FacilitiesService;

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
            entities: [RecreationalFacility, RecreationalBooking],
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

    service = module.get(FacilitiesService);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should create a facility', async () => {
    const result = await service.create({
      name: 'Swimming Pool',
      type: FacilityType.SWIMMING_POOL,
      capacity: 50,
      location: 'Ground Floor',
      openingTime: '06:00',
      closingTime: '22:00',
      available: true,
      minimumBookingHours: 1,
      maximumBookingHours: 4,
    });

    expect(result).toBeDefined();
    expect(result.id).toBeDefined();
    expect(result.name).toBe('Swimming Pool');
    expect(result.status).toBe(FacilityStatus.AVAILABLE);
  });

  it('should find all facilities', async () => {
    const results = await service.findAll({});
    expect(results.length).toBeGreaterThanOrEqual(1);
  });

  it('should find facility by id', async () => {
    const created = await service.create({
      name: 'Gym',
      type: FacilityType.GYM,
      capacity: 30,
      location: 'First Floor',
      openingTime: '05:00',
      closingTime: '23:00',
      available: true,
      minimumBookingHours: 1,
      maximumBookingHours: 4,
    });

    const found = await service.findOne(created.id);
    expect(found.id).toBe(created.id);
    expect(found.name).toBe('Gym');
  });

  it('should update a facility', async () => {
    const created = await service.create({
      name: 'Tennis Court',
      type: FacilityType.TENNIS_COURT,
      capacity: 4,
      location: 'Outdoor Area',
      openingTime: '07:00',
      closingTime: '20:00',
      available: true,
      minimumBookingHours: 1,
      maximumBookingHours: 4,
    });

    const updated = await service.update(created.id, {
      capacity: 8,
    });
    expect(updated.capacity).toBe(8);
  });

  it('should remove a facility without active bookings', async () => {
    const created = await service.create({
      name: 'To Remove',
      type: FacilityType.SWIMMING_POOL,
      capacity: 10,
      location: 'Rooftop',
      openingTime: '08:00',
      closingTime: '18:00',
      available: true,
      minimumBookingHours: 1,
      maximumBookingHours: 4,
    });

    const removed = await service.remove(created.id);
    expect(removed).toBeDefined();
  });

  it('should throw 404 for non-existent facility', async () => {
    await expect(service.findOne(99999)).rejects.toThrow();
  });
});
