import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { newDb, DataType } from 'pg-mem';
import { of } from 'rxjs';
import { ReservationsModule } from './reservations.module';
import { ReservationsService } from './reservations.service';
import { Reservation } from './entities/reservation.entity';
import { Room } from '../rooms/entities/room.entity';
import { Guest } from '../guests/entities/guest.entity';
import { RoomsModule } from '../rooms/rooms.module';
import { RoomsService } from '../rooms/rooms.service';
import { NotificationsService } from '../notifications-service/notifications/notifications.service';
import { ReservationStatus, RoomType } from '@app/contracts/booking-service';

describe('ReservationsService (integration)', () => {
  let module: TestingModule;
  let service: ReservationsService;
  let roomsService: RoomsService;
  let roomId: number;

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
            entities: [Reservation, Room, Guest],
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
        ReservationsModule,
        RoomsModule,
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

    service = module.get(ReservationsService);
    roomsService = module.get(RoomsService);

    const room = await roomsService.create({
      number: 'INT-101',
      type: RoomType.DOBLE,
      price: 150,
      capacity: 2,
    });
    roomId = room.id;
  });

  afterAll(async () => {
    await module.close();
  });

  it('should create a reservation', async () => {
    const result = await service.create({
      guestName: 'Alice Johnson',
      guestEmail: 'alice@example.com',
      checkInDate: new Date('2026-07-01'),
      checkOutDate: new Date('2026-07-05'),
      guests: 2,
      roomId,
    });

    expect(result).toBeDefined();
    expect(result.id).toBeDefined();
    expect(result.guestName).toBe('Alice Johnson');
    expect(result.status).toBe(ReservationStatus.PENDING);
    expect(result.nights).toBe(4);
    expect(result.totalAmount).toBe(600); // 4 nights * $150
  });

  it('should find all reservations', async () => {
    const results = await service.findAll({});
    expect(results.length).toBeGreaterThanOrEqual(1);
  });

  it('should find reservation by id', async () => {
    const created = await service.create({
      guestName: 'Bob',
      guestEmail: 'bob@example.com',
      checkInDate: new Date('2026-08-01'),
      checkOutDate: new Date('2026-08-03'),
      guests: 1,
      roomId,
    });

    const found = await service.findOne(created.id);
    expect(found.id).toBe(created.id);
  });

  it('should update a reservation', async () => {
    const created = await service.create({
      guestName: 'Charlie',
      guestEmail: 'charlie@example.com',
      checkInDate: new Date('2026-09-01'),
      checkOutDate: new Date('2026-09-03'),
      guests: 1,
      roomId,
    });

    const updated = await service.update(created.id, {
      status: ReservationStatus.CONFIRMED,
    });
    expect(updated.status).toBe(ReservationStatus.CONFIRMED);
  });

  it('should remove a reservation', async () => {
    const created = await service.create({
      guestName: 'Dave',
      guestEmail: 'dave@example.com',
      checkInDate: new Date('2026-10-01'),
      checkOutDate: new Date('2026-10-02'),
      guests: 1,
      roomId,
    });

    const removed = await service.remove(created.id);
    expect(removed).toBeDefined();
  });
});
