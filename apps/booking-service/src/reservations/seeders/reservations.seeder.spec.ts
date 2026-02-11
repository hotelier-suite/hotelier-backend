jest.mock('../../guests', () => ({
  Guest: class Guest {},
}));

jest.mock('../../rooms', () => ({
  Room: class Room {},
}));

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ReservationsSeeder, Reservation } from '../';
import { Room } from '../../rooms';
import { Guest } from '../../guests';

describe('ReservationsSeeder', () => {
  let seeder: ReservationsSeeder;
  const mockReservationRepo: Record<string, jest.Mock> = {
    findOne: jest.fn(),
    save: jest.fn(),
  };
  const mockRoomRepo: Record<string, jest.Mock> = {
    find: jest.fn(),
    update: jest.fn(),
  };
  const mockGuestRepo: Record<string, jest.Mock> = {
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReservationsSeeder,
        {
          provide: getRepositoryToken(Reservation),
          useValue: mockReservationRepo,
        },
        { provide: getRepositoryToken(Room), useValue: mockRoomRepo },
        { provide: getRepositoryToken(Guest), useValue: mockGuestRepo },
      ],
    }).compile();

    seeder = module.get<ReservationsSeeder>(ReservationsSeeder);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(seeder).toBeDefined();
  });

  it('should skip seeding when no rooms exist', async () => {
    mockRoomRepo.find.mockResolvedValueOnce([]);
    mockGuestRepo.find.mockResolvedValueOnce([{ id: 1, name: 'Guest' }]);

    await seeder.seed();

    expect(mockReservationRepo.save).not.toHaveBeenCalled();
  });

  it('should skip seeding when no guests exist', async () => {
    mockRoomRepo.find.mockResolvedValueOnce([
      { id: 1, number: '101', price: 50 },
    ]);
    mockGuestRepo.find.mockResolvedValueOnce([]);

    await seeder.seed();

    expect(mockReservationRepo.save).not.toHaveBeenCalled();
  });

  it('should seed reservations when they do not exist', async () => {
    const rooms = [
      { id: 1, number: '101', price: 50 },
      { id: 2, number: '201', price: 75 },
    ];
    const guests = [
      {
        id: 1,
        name: 'John Smith',
        email: 'john@example.com',
        phone: '+1-555-123',
      },
      {
        id: 2,
        name: 'Mary',
        email: 'mary@example.com',
        phone: '+1-555-456',
      },
    ];

    mockRoomRepo.find.mockResolvedValueOnce(rooms);
    mockGuestRepo.find.mockResolvedValueOnce(guests);
    mockReservationRepo.findOne.mockResolvedValue(null); // none exist
    mockReservationRepo.save.mockResolvedValue({});
    mockRoomRepo.update.mockResolvedValue({});

    await seeder.seed();

    expect(mockReservationRepo.save).toHaveBeenCalledTimes(2);
    expect(mockRoomRepo.update).toHaveBeenCalledTimes(2);
  });

  it('should skip existing reservations', async () => {
    const rooms = [
      { id: 1, number: '101', price: 50 },
      { id: 2, number: '201', price: 75 },
    ];
    const guests = [
      {
        id: 1,
        name: 'John Smith',
        email: 'john@example.com',
        phone: '+1-555',
      },
      {
        id: 2,
        name: 'Mary',
        email: 'mary@example.com',
        phone: '+1-555',
      },
    ];

    mockRoomRepo.find.mockResolvedValueOnce(rooms);
    mockGuestRepo.find.mockResolvedValueOnce(guests);
    mockReservationRepo.findOne.mockResolvedValue({ id: 1 }); // all exist

    await seeder.seed();

    expect(mockReservationRepo.save).not.toHaveBeenCalled();
  });
});
