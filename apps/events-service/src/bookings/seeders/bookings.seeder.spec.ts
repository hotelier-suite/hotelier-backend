import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BookingsSeeder } from './bookings.seeder';
import { EventBooking } from '../entities';
import { Venue } from '../../venues';

describe('BookingsSeeder', () => {
  let seeder: BookingsSeeder;
  let bookingRepo: Record<string, jest.Mock>;
  let venueRepo: Record<string, jest.Mock>;

  const mockVenues = [
    { id: 1, name: 'Garden Pavilion' },
    { id: 2, name: 'Conference Room Alpha' },
    { id: 3, name: 'Grand Ballroom' },
    { id: 4, name: 'Executive Suite' },
  ];

  beforeEach(async () => {
    bookingRepo = {
      findOne: jest.fn(),
      save: jest.fn(),
    };

    venueRepo = {
      find: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingsSeeder,
        { provide: getRepositoryToken(EventBooking), useValue: bookingRepo },
        { provide: getRepositoryToken(Venue), useValue: venueRepo },
      ],
    }).compile();

    seeder = module.get(BookingsSeeder);
  });

  it('should be defined', () => {
    expect(seeder).toBeDefined();
  });

  it('should seed bookings when venues exist and no bookings exist', async () => {
    venueRepo.find.mockResolvedValueOnce(mockVenues);
    bookingRepo.findOne.mockResolvedValue(null);
    bookingRepo.save.mockResolvedValue({});

    await seeder.seed();

    expect(bookingRepo.findOne).toHaveBeenCalledTimes(4);
    expect(bookingRepo.save).toHaveBeenCalledTimes(4);
  });

  it('should skip seeding when no venues found', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    venueRepo.find.mockResolvedValueOnce([]);

    await seeder.seed();

    expect(bookingRepo.findOne).not.toHaveBeenCalled();
    expect(bookingRepo.save).not.toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it('should skip existing bookings', async () => {
    venueRepo.find.mockResolvedValueOnce(mockVenues);
    bookingRepo.findOne.mockResolvedValue({ id: 1, title: 'Existing' });
    bookingRepo.save.mockResolvedValue({});

    await seeder.seed();

    expect(bookingRepo.findOne).toHaveBeenCalledTimes(4);
    expect(bookingRepo.save).not.toHaveBeenCalled();
  });

  it('should seed only missing bookings', async () => {
    venueRepo.find.mockResolvedValueOnce(mockVenues);
    bookingRepo.findOne
      .mockResolvedValueOnce({ id: 1, title: 'Existing' })
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({ id: 4, title: 'Existing' });
    bookingRepo.save.mockResolvedValue({});

    await seeder.seed();

    expect(bookingRepo.save).toHaveBeenCalledTimes(2);
  });
});
