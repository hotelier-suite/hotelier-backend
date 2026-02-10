import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RpcException } from '@nestjs/microservices';
import { RoomServiceOrdersService } from './room-service-orders.service';
import { RoomServiceOrder } from './entities';
import { RoomServiceStatus } from '@app/contracts/restaurant-service';

describe('RoomServiceOrdersService', () => {
  let service: RoomServiceOrdersService;
  let repo: Record<string, jest.Mock>;

  const mockOrder = {
    id: 1,
    orderNumber: 'RS-001',
    room: '201',
    guest: 'John Doe',
    items: [{ item: 'Sandwich', quantity: 1, price: 18.5 }],
    total: 18.5,
    orderDate: new Date(),
    status: RoomServiceStatus.PENDING,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    repo = {
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      merge: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoomServiceOrdersService,
        { provide: getRepositoryToken(RoomServiceOrder), useValue: repo },
      ],
    }).compile();

    service = module.get(RoomServiceOrdersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all orders', async () => {
      repo.find.mockResolvedValueOnce([mockOrder]);
      const result = await service.findAll();
      expect(result).toEqual([mockOrder]);
    });
  });

  describe('findOne', () => {
    it('should return an order by id', async () => {
      repo.findOne.mockResolvedValueOnce(mockOrder);
      const result = await service.findOne(1);
      expect(result).toEqual(mockOrder);
    });

    it('should throw RpcException when not found', async () => {
      repo.findOne.mockResolvedValueOnce(null);
      await expect(service.findOne(999)).rejects.toThrow(RpcException);
    });
  });

  describe('create', () => {
    it('should create and save an order', async () => {
      const dto = {
        room: '201',
        guest: 'John Doe',
        items: [{ item: 'Sandwich', quantity: 1, price: 18.5 }],
        total: 18.5,
      };
      repo.create.mockReturnValue(dto);
      repo.save.mockResolvedValueOnce({ id: 1, ...dto });
      const result = await service.create(dto);
      expect(result).toHaveProperty('id', 1);
    });
  });

  describe('update', () => {
    it('should update an existing order', async () => {
      repo.findOne.mockResolvedValueOnce(mockOrder);
      repo.create.mockReturnValue(mockOrder);
      const merged = { ...mockOrder, status: RoomServiceStatus.PREPARING };
      repo.merge.mockReturnValue(merged);
      repo.save.mockResolvedValueOnce(merged);
      const result = await service.update(1, {
        status: RoomServiceStatus.PREPARING,
      });
      expect(result.status).toBe(RoomServiceStatus.PREPARING);
    });

    it('should throw when not found', async () => {
      repo.findOne.mockResolvedValueOnce(null);
      await expect(service.update(999, {})).rejects.toThrow(RpcException);
    });
  });

  describe('remove', () => {
    it('should remove an order', async () => {
      repo.findOne.mockResolvedValueOnce(mockOrder);
      repo.create.mockReturnValue(mockOrder);
      repo.remove.mockResolvedValueOnce(mockOrder);
      const result = await service.remove(1);
      expect(result).toEqual(mockOrder);
    });

    it('should throw when not found', async () => {
      repo.findOne.mockResolvedValueOnce(null);
      await expect(service.remove(999)).rejects.toThrow(RpcException);
    });
  });
});
