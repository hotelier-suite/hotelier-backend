jest.mock('../guests', () => ({
  GuestsSeeder: class GuestsSeeder {
    seed = jest.fn().mockResolvedValue(undefined);
  },
  GuestsSeedersModule: class GuestsSeedersModule {},
}));

jest.mock('../reservations', () => ({
  ReservationsSeeder: class ReservationsSeeder {
    seed = jest.fn().mockResolvedValue(undefined);
  },
  ReservationsSeedersModule: class ReservationsSeedersModule {},
}));

jest.mock('../rooms', () => ({
  RoomsSeeder: class RoomsSeeder {
    seed = jest.fn().mockResolvedValue(undefined);
  },
  RoomsSeedersModule: class RoomsSeedersModule {},
}));

import { Test, TestingModule } from '@nestjs/testing';
import { SeedersService } from './';
import { GuestsSeeder } from '../guests';
import { ReservationsSeeder } from '../reservations';
import { RoomsSeeder } from '../rooms';

describe('SeedersService', () => {
  let service: SeedersService;
  let roomsSeeder: RoomsSeeder;
  let guestsSeeder: GuestsSeeder;
  let reservationsSeeder: ReservationsSeeder;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SeedersService,
        RoomsSeeder,
        GuestsSeeder,
        ReservationsSeeder,
      ],
    }).compile();

    service = module.get<SeedersService>(SeedersService);
    roomsSeeder = module.get<RoomsSeeder>(RoomsSeeder);
    guestsSeeder = module.get<GuestsSeeder>(GuestsSeeder);
    reservationsSeeder = module.get<ReservationsSeeder>(ReservationsSeeder);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call all seeders in order', async () => {
    const roomsSpy = jest
      .spyOn(roomsSeeder, 'seed')
      .mockResolvedValueOnce(undefined);
    const guestsSpy = jest
      .spyOn(guestsSeeder, 'seed')
      .mockResolvedValueOnce(undefined);
    const reservationsSpy = jest
      .spyOn(reservationsSeeder, 'seed')
      .mockResolvedValueOnce(undefined);

    await service.seed();

    expect(roomsSpy).toHaveBeenCalled();
    expect(guestsSpy).toHaveBeenCalled();
    expect(reservationsSpy).toHaveBeenCalled();
  });
});
