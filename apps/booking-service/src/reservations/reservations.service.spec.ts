jest.mock('../guests', () => ({
  Guest: class Guest {},
}));

jest.mock('../rooms', () => ({
  Room: class Room {},
}));

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RpcException } from '@nestjs/microservices';
import { ReservationsService, Reservation } from './';
import { Room } from '../rooms';
import { Guest } from '../guests';
import { NotificationsService } from '../notifications-service';

describe('ReservationsService', () => {
  let service: ReservationsService;

  const mockRoomQb: Record<string, jest.Mock> = {
    leftJoin: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    getMany: jest.fn(),
  };

  const mockResQb: Record<string, jest.Mock> = {
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    getCount: jest.fn(),
  };

  const mockReservationRepo: Record<string, jest.Mock> = {
    find: jest.fn(),
    findOne: jest.fn(),
    count: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    merge: jest.fn(),
    remove: jest.fn(),
    createQueryBuilder: jest.fn().mockReturnValue(mockResQb),
  };

  const mockRoomRepo: Record<string, jest.Mock> = {
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    createQueryBuilder: jest.fn().mockReturnValue(mockRoomQb),
  };

  const mockGuestRepo: Record<string, jest.Mock> = {
    find: jest.fn(),
    findOne: jest.fn(),
  };

  const mockNotificationsService = {
    create: jest.fn().mockReturnValue({ subscribe: jest.fn() }),
  };

  const mockRoom = {
    id: 1,
    number: '101',
    type: 'DOBLE',
    price: 75,
    capacity: 2,
    isAvailable: true,
  };

  const mockGuest = {
    id: 1,
    name: 'John Smith',
    email: 'john@example.com',
  };

  const mockReservation = {
    id: 1,
    guestName: 'John Smith',
    guestEmail: 'john@example.com',
    checkInDate: new Date(2024, 5, 15),
    checkOutDate: new Date(2024, 5, 18),
    nights: 3,
    guests: 2,
    totalAmount: 225,
    discountPercent: null,
    discountAmount: null,
    status: 'CONFIRMED',
    channel: 'DIRECT',
    roomId: 1,
    guestId: 1,
    createdAt: new Date(2024, 5, 15),
    updatedAt: new Date(2024, 5, 15),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReservationsService,
        {
          provide: getRepositoryToken(Reservation),
          useValue: mockReservationRepo,
        },
        { provide: getRepositoryToken(Room), useValue: mockRoomRepo },
        { provide: getRepositoryToken(Guest), useValue: mockGuestRepo },
        {
          provide: NotificationsService,
          useValue: mockNotificationsService,
        },
      ],
    }).compile();

    service = module.get<ReservationsService>(ReservationsService);
    jest.clearAllMocks();
    // Reset QB mocks
    mockRoomQb.leftJoin.mockReturnThis();
    mockRoomQb.where.mockReturnThis();
    mockRoomQb.andWhere.mockReturnThis();
    mockRoomQb.orderBy.mockReturnThis();
    mockResQb.where.mockReturnThis();
    mockResQb.andWhere.mockReturnThis();
    mockReservationRepo.createQueryBuilder.mockReturnValue(mockResQb);
    mockRoomRepo.createQueryBuilder.mockReturnValue(mockRoomQb);
    mockNotificationsService.create.mockReturnValue({
      subscribe: jest.fn(),
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return reservations with empty filters', async () => {
      mockReservationRepo.find.mockResolvedValueOnce([mockReservation]);
      const result = await service.findAll({});
      expect(result).toEqual([mockReservation]);
    });

    it('should filter by userId', async () => {
      mockReservationRepo.find.mockResolvedValueOnce([mockReservation]);
      const result = await service.findAll({ userId: 1 });
      expect(result).toEqual([mockReservation]);
      expect(mockReservationRepo.find).toHaveBeenCalled();
    });

    it('should filter by status', async () => {
      mockReservationRepo.find.mockResolvedValueOnce([mockReservation]);
      const result = await service.findAll({ status: 'CONFIRMED' as never });
      expect(result).toEqual([mockReservation]);
    });

    it('should filter by isCurrent', async () => {
      mockReservationRepo.find.mockResolvedValueOnce([mockReservation]);
      const result = await service.findAll({ isCurrent: true });
      expect(result).toEqual([mockReservation]);
      expect(mockReservationRepo.find).toHaveBeenCalled();
    });

    it('should filter by startDate and endDate', async () => {
      mockReservationRepo.find.mockResolvedValueOnce([]);
      const start = new Date(2024, 5, 1);
      const end = new Date(2024, 5, 30);
      const result = await service.findAll({
        startDate: start,
        endDate: end,
      });
      expect(result).toEqual([]);
    });

    it('should filter by startDate only', async () => {
      mockReservationRepo.find.mockResolvedValueOnce([]);
      const result = await service.findAll({
        startDate: new Date(2024, 5, 1),
      });
      expect(result).toEqual([]);
    });

    it('should filter by endDate only', async () => {
      mockReservationRepo.find.mockResolvedValueOnce([]);
      const result = await service.findAll({
        endDate: new Date(2024, 5, 30),
      });
      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a reservation by id', async () => {
      mockReservationRepo.findOne.mockResolvedValueOnce(mockReservation);
      const result = await service.findOne(1);
      expect(result).toEqual(mockReservation);
    });

    it('should throw RpcException when not found', async () => {
      mockReservationRepo.findOne.mockResolvedValueOnce(null);
      await expect(service.findOne(999)).rejects.toThrow(RpcException);
    });
  });

  describe('getAvailability', () => {
    it('should return available rooms', async () => {
      mockRoomQb.getMany.mockResolvedValueOnce([mockRoom]);
      const result = await service.getAvailability({
        startDate: new Date(2024, 5, 15),
        endDate: new Date(2024, 5, 18),
      });
      expect(result).toEqual([mockRoom]);
      expect(mockRoomRepo.createQueryBuilder).toHaveBeenCalledWith('room');
    });

    it('should throw on invalid date range', async () => {
      const start = new Date(2024, 5, 18);
      const end = new Date(2024, 5, 15);
      await expect(
        service.getAvailability({ startDate: start, endDate: end }),
      ).rejects.toThrow(RpcException);
    });

    it('should filter by type when provided', async () => {
      mockRoomQb.getMany.mockResolvedValueOnce([]);
      await service.getAvailability({
        startDate: new Date(2024, 5, 15),
        endDate: new Date(2024, 5, 18),
        type: 'SUITE' as never,
      });
      expect(mockRoomQb.andWhere).toHaveBeenCalledWith(
        'room.type = :type',
        expect.objectContaining({ type: 'SUITE' }),
      );
    });

    it('should filter by guests when provided', async () => {
      mockRoomQb.getMany.mockResolvedValueOnce([]);
      await service.getAvailability({
        startDate: new Date(2024, 5, 15),
        endDate: new Date(2024, 5, 18),
        guests: 3,
      });
      expect(mockRoomQb.andWhere).toHaveBeenCalledWith(
        'room.capacity >= :minGuests',
        expect.objectContaining({ minGuests: 3 }),
      );
    });
  });

  describe('create', () => {
    const createDto = {
      guestName: 'John Smith',
      guestEmail: 'john@example.com',
      checkInDate: new Date(2024, 5, 15),
      checkOutDate: new Date(2024, 5, 18),
      guests: 2,
      roomId: 1,
      channel: 'DIRECT' as never,
    };

    it('should create a reservation successfully', async () => {
      mockRoomRepo.findOne.mockResolvedValueOnce(mockRoom);
      mockReservationRepo.count.mockResolvedValueOnce(0); // no overlap
      mockReservationRepo.create.mockReturnValueOnce(mockReservation);
      mockReservationRepo.save.mockResolvedValueOnce(mockReservation);

      const result = await service.create(createDto);
      expect(result).toEqual(mockReservation);
    });

    it('should throw on invalid date range', async () => {
      const badDto = {
        ...createDto,
        checkInDate: new Date(2024, 5, 18),
        checkOutDate: new Date(2024, 5, 15),
      };
      await expect(service.create(badDto)).rejects.toThrow(RpcException);
    });

    it('should throw when room not found', async () => {
      mockRoomRepo.findOne.mockResolvedValueOnce(null);
      await expect(service.create(createDto)).rejects.toThrow(RpcException);
    });

    it('should throw when guests exceed capacity', async () => {
      mockRoomRepo.findOne.mockResolvedValueOnce({
        ...mockRoom,
        capacity: 1,
      });
      await expect(service.create(createDto)).rejects.toThrow(RpcException);
    });

    it('should throw when guest not found', async () => {
      const dtoWithGuest = { ...createDto, guestId: 999 };
      mockRoomRepo.findOne.mockResolvedValueOnce(mockRoom);
      mockGuestRepo.findOne.mockResolvedValueOnce(null);
      await expect(service.create(dtoWithGuest)).rejects.toThrow(RpcException);
    });

    it('should throw when room has overlap', async () => {
      mockRoomRepo.findOne.mockResolvedValueOnce(mockRoom);
      mockReservationRepo.count.mockResolvedValueOnce(1); // overlap
      await expect(service.create(createDto)).rejects.toThrow(RpcException);
    });

    it('should validate guest exists when guestId is provided', async () => {
      const dtoWithGuest = { ...createDto, guestId: 1 };
      mockRoomRepo.findOne.mockResolvedValueOnce(mockRoom);
      mockGuestRepo.findOne.mockResolvedValueOnce(mockGuest);
      mockReservationRepo.count.mockResolvedValueOnce(0);
      mockReservationRepo.create.mockReturnValueOnce(mockReservation);
      mockReservationRepo.save.mockResolvedValueOnce(mockReservation);

      const result = await service.create(dtoWithGuest);
      expect(result).toEqual(mockReservation);
    });

    it('should apply discount percent', async () => {
      const dtoWithDiscount = { ...createDto, discountPercent: 10 };
      mockRoomRepo.findOne.mockResolvedValueOnce(mockRoom);
      mockReservationRepo.count.mockResolvedValueOnce(0);
      mockReservationRepo.create.mockReturnValueOnce(mockReservation);
      mockReservationRepo.save.mockResolvedValueOnce(mockReservation);

      await service.create(dtoWithDiscount);
      expect(mockReservationRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({ nights: 3 }),
      );
    });

    it('should apply discount amount', async () => {
      const dtoWithDiscount = { ...createDto, discountAmount: 20 };
      mockRoomRepo.findOne.mockResolvedValueOnce(mockRoom);
      mockReservationRepo.count.mockResolvedValueOnce(0);
      mockReservationRepo.create.mockReturnValueOnce(mockReservation);
      mockReservationRepo.save.mockResolvedValueOnce(mockReservation);

      await service.create(dtoWithDiscount);
      expect(mockReservationRepo.create).toHaveBeenCalled();
    });

    it('should clamp total to zero when discounts exceed price', async () => {
      const dtoWithBigDiscount = {
        ...createDto,
        discountPercent: 50,
        discountAmount: 9999,
      };
      mockRoomRepo.findOne.mockResolvedValueOnce(mockRoom);
      mockReservationRepo.count.mockResolvedValueOnce(0);
      mockReservationRepo.create.mockReturnValueOnce(mockReservation);
      mockReservationRepo.save.mockResolvedValueOnce(mockReservation);

      await service.create(dtoWithBigDiscount);
      expect(mockReservationRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({ totalAmount: 0 }),
      );
    });

    it('should send notification on create', async () => {
      mockRoomRepo.findOne.mockResolvedValueOnce(mockRoom);
      mockReservationRepo.count.mockResolvedValueOnce(0);
      mockReservationRepo.create.mockReturnValueOnce(mockReservation);
      mockReservationRepo.save.mockResolvedValueOnce(mockReservation);

      await service.create(createDto);
      expect(mockNotificationsService.create).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update a reservation', async () => {
      const updated = { ...mockReservation, notes: 'updated note' };
      mockReservationRepo.findOne.mockResolvedValueOnce(mockReservation);
      mockRoomRepo.findOne.mockResolvedValueOnce(mockRoom);
      mockReservationRepo.create.mockReturnValueOnce(mockReservation);
      mockReservationRepo.merge.mockReturnValueOnce(updated);
      mockReservationRepo.save.mockResolvedValueOnce(updated);

      const result = await service.update(1, { notes: 'updated note' });
      expect(result).toEqual(updated);
    });

    it('should throw on invalid date range when dates change', async () => {
      mockReservationRepo.findOne.mockResolvedValueOnce(mockReservation);
      await expect(
        service.update(1, { checkOutDate: new Date(2024, 5, 10) }),
      ).rejects.toThrow(RpcException);
    });

    it('should throw when room not found', async () => {
      mockReservationRepo.findOne.mockResolvedValueOnce(mockReservation);
      mockRoomRepo.findOne.mockResolvedValueOnce(null);
      await expect(service.update(1, { roomId: 999 })).rejects.toThrow(
        RpcException,
      );
    });

    it('should throw when guests exceed capacity', async () => {
      mockReservationRepo.findOne.mockResolvedValueOnce(mockReservation);
      mockRoomRepo.findOne.mockResolvedValueOnce({
        ...mockRoom,
        capacity: 1,
      });
      await expect(service.update(1, { guests: 3 })).rejects.toThrow(
        RpcException,
      );
    });

    it('should validate guest when guestId changes', async () => {
      mockReservationRepo.findOne.mockResolvedValueOnce(mockReservation);
      mockRoomRepo.findOne.mockResolvedValueOnce(mockRoom);
      mockGuestRepo.findOne.mockResolvedValueOnce(null);
      await expect(service.update(1, { guestId: 999 })).rejects.toThrow(
        RpcException,
      );
    });

    it('should check room conflicts when room changes', async () => {
      mockReservationRepo.findOne.mockResolvedValueOnce(mockReservation);
      mockRoomRepo.findOne.mockResolvedValueOnce(mockRoom);
      mockResQb.getCount.mockResolvedValueOnce(1); // conflict

      await expect(service.update(1, { roomId: 2 })).rejects.toThrow(
        RpcException,
      );
    });

    it('should check room conflicts when dates change', async () => {
      mockReservationRepo.findOne.mockResolvedValueOnce(mockReservation);
      mockRoomRepo.findOne.mockResolvedValueOnce(mockRoom);
      mockResQb.getCount.mockResolvedValueOnce(0); // no conflict
      mockReservationRepo.create.mockReturnValueOnce(mockReservation);
      mockReservationRepo.merge.mockReturnValueOnce(mockReservation);
      mockReservationRepo.save.mockResolvedValueOnce(mockReservation);

      await service.update(1, { checkInDate: new Date(2024, 5, 16) });
      expect(mockReservationRepo.createQueryBuilder).toHaveBeenCalled();
    });

    it('should set room unavailable when status CONFIRMED', async () => {
      mockReservationRepo.findOne.mockResolvedValueOnce(mockReservation);
      mockRoomRepo.findOne.mockResolvedValueOnce(mockRoom);
      mockReservationRepo.create.mockReturnValueOnce(mockReservation);
      mockReservationRepo.merge.mockReturnValueOnce(mockReservation);
      mockReservationRepo.save.mockResolvedValueOnce(mockReservation);

      await service.update(1, { status: 'CONFIRMED' as never });
      expect(mockRoomRepo.update).toHaveBeenCalledWith(1, {
        isAvailable: false,
      });
    });

    it('should set room unavailable when status CHECKED_IN', async () => {
      mockReservationRepo.findOne.mockResolvedValueOnce(mockReservation);
      mockRoomRepo.findOne.mockResolvedValueOnce(mockRoom);
      mockReservationRepo.create.mockReturnValueOnce(mockReservation);
      mockReservationRepo.merge.mockReturnValueOnce(mockReservation);
      mockReservationRepo.save.mockResolvedValueOnce(mockReservation);

      await service.update(1, { status: 'CHECKED_IN' as never });
      expect(mockRoomRepo.update).toHaveBeenCalledWith(1, {
        isAvailable: false,
      });
    });

    it('should set room available when status CANCELLED', async () => {
      mockReservationRepo.findOne.mockResolvedValueOnce(mockReservation);
      mockRoomRepo.findOne.mockResolvedValueOnce(mockRoom);
      mockReservationRepo.create.mockReturnValueOnce(mockReservation);
      mockReservationRepo.merge.mockReturnValueOnce(mockReservation);
      mockReservationRepo.save.mockResolvedValueOnce(mockReservation);

      await service.update(1, { status: 'CANCELLED' as never });
      expect(mockRoomRepo.update).toHaveBeenCalledWith(1, {
        isAvailable: true,
      });
    });

    it('should recalculate total when discount changes', async () => {
      mockReservationRepo.findOne.mockResolvedValueOnce(mockReservation);
      mockRoomRepo.findOne.mockResolvedValueOnce(mockRoom);
      mockReservationRepo.create.mockReturnValueOnce(mockReservation);
      mockReservationRepo.merge.mockReturnValueOnce(mockReservation);
      mockReservationRepo.save.mockResolvedValueOnce(mockReservation);

      await service.update(1, { discountPercent: 20 });
      expect(mockReservationRepo.merge).toHaveBeenCalled();
    });

    it('should recalculate total with discount amount', async () => {
      mockReservationRepo.findOne.mockResolvedValueOnce(mockReservation);
      mockRoomRepo.findOne.mockResolvedValueOnce(mockRoom);
      mockReservationRepo.create.mockReturnValueOnce(mockReservation);
      mockReservationRepo.merge.mockReturnValueOnce(mockReservation);
      mockReservationRepo.save.mockResolvedValueOnce(mockReservation);

      await service.update(1, { discountAmount: 50 });
      expect(mockReservationRepo.merge).toHaveBeenCalled();
    });

    it('should clamp total to zero on recalculation', async () => {
      mockReservationRepo.findOne.mockResolvedValueOnce(mockReservation);
      mockRoomRepo.findOne.mockResolvedValueOnce(mockRoom);
      mockReservationRepo.create.mockReturnValueOnce(mockReservation);
      mockReservationRepo.merge.mockReturnValueOnce(mockReservation);
      mockReservationRepo.save.mockResolvedValueOnce(mockReservation);

      await service.update(1, {
        discountPercent: 50,
        discountAmount: 9999,
      });
      expect(mockReservationRepo.merge).toHaveBeenCalledWith(
        mockReservation,
        expect.objectContaining({ totalAmount: 0 }),
      );
    });

    it('should validate guest when guestId is provided and valid', async () => {
      mockReservationRepo.findOne.mockResolvedValueOnce(mockReservation);
      mockRoomRepo.findOne.mockResolvedValueOnce(mockRoom);
      mockGuestRepo.findOne.mockResolvedValueOnce(mockGuest);
      mockReservationRepo.create.mockReturnValueOnce(mockReservation);
      mockReservationRepo.merge.mockReturnValueOnce(mockReservation);
      mockReservationRepo.save.mockResolvedValueOnce(mockReservation);

      const result = await service.update(1, { guestId: 1 });
      expect(result).toEqual(mockReservation);
    });
  });

  describe('checkout', () => {
    it('should checkout a reservation', async () => {
      const checkedIn = { ...mockReservation, status: 'CHECKED_IN', roomId: 1 };
      const checkedOut = {
        ...mockReservation,
        status: 'CHECKED_OUT',
        id: 1,
        roomId: 1,
      };
      mockReservationRepo.findOne.mockResolvedValue(checkedIn);
      mockReservationRepo.create.mockReturnValue(checkedIn);
      mockReservationRepo.merge.mockReturnValue(checkedOut);
      mockReservationRepo.save.mockResolvedValue(checkedOut);
      mockRoomRepo.update.mockResolvedValue({});

      const result = await service.checkout(1);
      expect(result.reservation).toEqual(checkedOut);
      expect(mockRoomRepo.update).toHaveBeenCalledWith(1, {
        isAvailable: false,
      });
    });

    it('should return immediately when already checked out', async () => {
      const checkedOut = { ...mockReservation, status: 'CHECKED_OUT' };
      mockReservationRepo.findOne.mockResolvedValue(checkedOut);

      const result = await service.checkout(1);
      expect(result.reservation).toEqual(checkedOut);
      expect(mockReservationRepo.save).not.toHaveBeenCalled();
    });

    it('should send notification on checkout', async () => {
      const checkedIn = { ...mockReservation, status: 'CHECKED_IN', roomId: 1 };
      const checkedOut = {
        ...mockReservation,
        status: 'CHECKED_OUT',
        id: 1,
        roomId: 1,
      };
      mockReservationRepo.findOne.mockResolvedValue(checkedIn);
      mockReservationRepo.create.mockReturnValue(checkedIn);
      mockReservationRepo.merge.mockReturnValue(checkedOut);
      mockReservationRepo.save.mockResolvedValue(checkedOut);
      mockRoomRepo.update.mockResolvedValue({});

      await service.checkout(1);
      expect(mockNotificationsService.create).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should remove a reservation', async () => {
      mockReservationRepo.findOne.mockResolvedValueOnce(mockReservation);
      mockReservationRepo.create.mockReturnValueOnce(mockReservation);
      mockReservationRepo.remove.mockResolvedValueOnce(mockReservation);
      const result = await service.remove(1);
      expect(result).toEqual(mockReservation);
    });
  });
});
