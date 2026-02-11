import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RecreationalBookingsSeeder } from './';
import { RecreationalBooking } from '../../bookings';
import { RecreationalFacility } from '../../facilities';

describe('RecreationalBookingsSeeder', () => {
  let seeder: RecreationalBookingsSeeder;

  const mockBookingRepository: Record<string, jest.Mock> = {
    count: jest.fn(),
    save: jest.fn(),
  };

  const mockFacilityRepository: Record<string, jest.Mock> = {
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RecreationalBookingsSeeder,
        {
          provide: getRepositoryToken(RecreationalBooking),
          useValue: mockBookingRepository,
        },
        {
          provide: getRepositoryToken(RecreationalFacility),
          useValue: mockFacilityRepository,
        },
      ],
    }).compile();

    seeder = module.get<RecreationalBookingsSeeder>(RecreationalBookingsSeeder);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(seeder).toBeDefined();
  });

  describe('seed', () => {
    it('should skip when bookings already exist', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      mockBookingRepository.count.mockResolvedValueOnce(10);
      await seeder.seed();
      expect(mockFacilityRepository.find).not.toHaveBeenCalled();
      expect(mockBookingRepository.save).not.toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it('should skip when no facilities exist', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      mockBookingRepository.count.mockResolvedValueOnce(0);
      mockFacilityRepository.find.mockResolvedValueOnce([]);
      await seeder.seed();
      expect(mockBookingRepository.save).not.toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it('should seed bookings when facilities exist and no bookings', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      mockBookingRepository.count.mockResolvedValueOnce(0);
      mockFacilityRepository.find.mockResolvedValueOnce([
        {
          id: 1,
          name: 'Pool',
          capacity: 25,
          openingTime: '06:00',
          closingTime: '22:00',
        },
        {
          id: 2,
          name: 'Gym',
          capacity: 15,
          openingTime: '05:00',
          closingTime: '23:00',
        },
      ]);
      mockBookingRepository.save.mockResolvedValue({ id: 1 });
      await seeder.seed();
      expect(mockBookingRepository.save).toHaveBeenCalled();
      const callCount = mockBookingRepository.save.mock.calls.length;
      expect(callCount).toBeGreaterThan(0);
      consoleSpy.mockRestore();
    });
  });
});
