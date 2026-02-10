// Break circular dependency between venues and bookings barrels
jest.mock('../venues', () => ({
  VenuesSeeder: class VenuesSeeder {},
}));
jest.mock('../bookings', () => ({
  BookingsSeeder: class BookingsSeeder {},
}));

import { Test, TestingModule } from '@nestjs/testing';
import { SeedersService } from './seeders.service';
import { VenuesSeeder } from '../venues';
import { EventsSeeder } from '../events';
import { BookingsSeeder } from '../bookings';

describe('SeedersService', () => {
  let service: SeedersService;
  let venuesSeeder: VenuesSeeder;
  let eventsSeeder: EventsSeeder;
  let bookingsSeeder: BookingsSeeder;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SeedersService,
        { provide: VenuesSeeder, useValue: { seed: jest.fn() } },
        { provide: EventsSeeder, useValue: { seed: jest.fn() } },
        { provide: BookingsSeeder, useValue: { seed: jest.fn() } },
      ],
    }).compile();

    service = module.get(SeedersService);
    venuesSeeder = module.get(VenuesSeeder);
    eventsSeeder = module.get(EventsSeeder);
    bookingsSeeder = module.get(BookingsSeeder);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call all seeders in order', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    const venuesSpy = jest
      .spyOn(venuesSeeder, 'seed')
      .mockResolvedValueOnce(undefined);
    const eventsSpy = jest
      .spyOn(eventsSeeder, 'seed')
      .mockResolvedValueOnce(undefined);
    const bookingsSpy = jest
      .spyOn(bookingsSeeder, 'seed')
      .mockResolvedValueOnce(undefined);

    await service.seed();

    expect(venuesSpy).toHaveBeenCalled();
    expect(eventsSpy).toHaveBeenCalled();
    expect(bookingsSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it('should seed venues before events and bookings', async () => {
    const callOrder: string[] = [];
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

    jest.spyOn(venuesSeeder, 'seed').mockImplementation(() => {
      callOrder.push('venues');
      return Promise.resolve();
    });
    jest.spyOn(eventsSeeder, 'seed').mockImplementation(() => {
      callOrder.push('events');
      return Promise.resolve();
    });
    jest.spyOn(bookingsSeeder, 'seed').mockImplementation(() => {
      callOrder.push('bookings');
      return Promise.resolve();
    });

    await service.seed();

    expect(callOrder).toEqual(['venues', 'events', 'bookings']);
    consoleSpy.mockRestore();
  });
});
