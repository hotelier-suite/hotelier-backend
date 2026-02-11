jest.mock('../guests', () => ({
  Guest: class Guest {},
}));

jest.mock('../rooms', () => ({
  Room: class Room {},
}));

import { Test, TestingModule } from '@nestjs/testing';
import { ReservationsController, ReservationsService } from './';

describe('ReservationsController', () => {
  let controller: ReservationsController;
  const mockService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    getAvailability: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    checkout: jest.fn(),
  };

  const mockReservation = {
    id: 1,
    guestName: 'John Smith',
    guestEmail: 'john@example.com',
    checkInDate: new Date(2024, 5, 15),
    checkOutDate: new Date(2024, 5, 18),
    nights: 3,
    guests: 2,
    totalAmount: 225.0,
    status: 'CONFIRMED',
    channel: 'DIRECT',
    roomId: 1,
    createdAt: new Date(2024, 5, 15),
    updatedAt: new Date(2024, 5, 15),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReservationsController],
      providers: [{ provide: ReservationsService, useValue: mockService }],
    }).compile();

    controller = module.get<ReservationsController>(ReservationsController);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all reservations', async () => {
      mockService.findAll.mockResolvedValueOnce([mockReservation]);
      const result = await controller.findAll({});
      expect(result).toEqual([mockReservation]);
    });
  });

  describe('findOne', () => {
    it('should return a reservation by id', async () => {
      mockService.findOne.mockResolvedValueOnce(mockReservation);
      const result = await controller.findOne(1);
      expect(result).toEqual(mockReservation);
    });
  });

  describe('getAvailability', () => {
    it('should return available rooms', async () => {
      const rooms = [{ id: 1, number: '101' }];
      mockService.getAvailability.mockResolvedValueOnce(rooms);
      const result = await controller.getAvailability({
        startDate: new Date(2024, 5, 15),
        endDate: new Date(2024, 5, 18),
      });
      expect(result).toEqual(rooms);
    });
  });

  describe('create', () => {
    it('should create a reservation', async () => {
      mockService.create.mockResolvedValueOnce(mockReservation);
      const result = await controller.create({
        guestName: 'John Smith',
        guestEmail: 'john@example.com',
        checkInDate: new Date(2024, 5, 15),
        checkOutDate: new Date(2024, 5, 18),
        guests: 2,
        roomId: 1,
        channel: 'DIRECT' as never,
      });
      expect(result).toEqual(mockReservation);
    });
  });

  describe('update', () => {
    it('should update a reservation', async () => {
      mockService.update.mockResolvedValueOnce(mockReservation);
      const result = await controller.update({
        id: 1,
        data: { guests: 3 },
      });
      expect(result).toEqual(mockReservation);
    });
  });

  describe('remove', () => {
    it('should remove a reservation', async () => {
      mockService.remove.mockResolvedValueOnce(mockReservation);
      const result = await controller.remove(1);
      expect(result).toEqual(mockReservation);
    });
  });

  describe('checkout', () => {
    it('should checkout a reservation', async () => {
      const response = { reservation: mockReservation };
      mockService.checkout.mockResolvedValueOnce(response);
      const result = await controller.checkout(1);
      expect(result).toEqual(response);
    });
  });
});
