import { Test, TestingModule } from '@nestjs/testing';
import { RoomServiceOrdersController } from './room-service-orders.controller';
import { RoomServiceOrdersService } from './room-service-orders.service';
import { RoomServiceStatus } from '@app/contracts/restaurant-service';

describe('RoomServiceOrdersController', () => {
  let controller: RoomServiceOrdersController;
  let service: RoomServiceOrdersService;

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
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoomServiceOrdersController],
      providers: [
        {
          provide: RoomServiceOrdersService,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get(RoomServiceOrdersController);
    service = module.get(RoomServiceOrdersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all orders', async () => {
      const spy = jest
        .spyOn(service, 'findAll')
        .mockResolvedValueOnce([mockOrder]);
      expect(await controller.findAll()).toEqual([mockOrder]);
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return an order by id', async () => {
      const spy = jest
        .spyOn(service, 'findOne')
        .mockResolvedValueOnce(mockOrder);
      expect(await controller.findOne(1)).toEqual(mockOrder);
      expect(spy).toHaveBeenCalledWith(1);
    });
  });

  describe('create', () => {
    it('should create an order', async () => {
      const dto = {
        room: '201',
        guest: 'John Doe',
        items: [{ item: 'Sandwich', quantity: 1, price: 18.5 }],
        total: 18.5,
      };
      const spy = jest
        .spyOn(service, 'create')
        .mockResolvedValueOnce(mockOrder);
      expect(await controller.create(dto)).toEqual(mockOrder);
      expect(spy).toHaveBeenCalledWith(dto);
    });
  });

  describe('update', () => {
    it('should update an order', async () => {
      const payload = {
        id: 1,
        data: { status: RoomServiceStatus.PREPARING },
      };
      const spy = jest.spyOn(service, 'update').mockResolvedValueOnce({
        ...mockOrder,
        status: RoomServiceStatus.PREPARING,
      });
      const result = await controller.update(payload);
      expect(result.status).toBe(RoomServiceStatus.PREPARING);
      expect(spy).toHaveBeenCalledWith(1, payload.data);
    });
  });

  describe('remove', () => {
    it('should remove an order', async () => {
      const spy = jest
        .spyOn(service, 'remove')
        .mockResolvedValueOnce(mockOrder);
      expect(await controller.remove(1)).toEqual(mockOrder);
      expect(spy).toHaveBeenCalledWith(1);
    });
  });
});
