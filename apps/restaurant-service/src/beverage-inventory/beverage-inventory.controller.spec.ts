import { Test, TestingModule } from '@nestjs/testing';
import { BeverageInventoryController } from './beverage-inventory.controller';
import { BeverageInventoryService } from './beverage-inventory.service';
import { BeverageStatus } from '@app/contracts/restaurant-service';

describe('BeverageInventoryController', () => {
  let controller: BeverageInventoryController;
  let service: BeverageInventoryService;

  const mockBeverage = {
    id: 1,
    itemCode: 'ALC001',
    name: 'Red Wine',
    category: 'Wine',
    stock: 24,
    minimumStock: 6,
    unit: 'bottles',
    unitCost: 25,
    supplier: 'Wine Ltd',
    status: BeverageStatus.AVAILABLE,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BeverageInventoryController],
      providers: [
        {
          provide: BeverageInventoryService,
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

    controller = module.get(BeverageInventoryController);
    service = module.get(BeverageInventoryService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should delegate to service', async () => {
      const spy = jest
        .spyOn(service, 'findAll')
        .mockResolvedValueOnce([mockBeverage]);
      expect(await controller.findAll({})).toEqual([mockBeverage]);
      expect(spy).toHaveBeenCalledWith({});
    });
  });

  describe('findOne', () => {
    it('should delegate to service', async () => {
      const spy = jest
        .spyOn(service, 'findOne')
        .mockResolvedValueOnce(mockBeverage);
      expect(await controller.findOne(1)).toEqual(mockBeverage);
      expect(spy).toHaveBeenCalledWith(1);
    });
  });

  describe('create', () => {
    it('should delegate to service', async () => {
      const dto = {
        name: 'Red Wine',
        category: 'Wine',
        stock: 24,
        minimumStock: 6,
        unit: 'bottles',
        unitCost: 25,
      };
      const spy = jest
        .spyOn(service, 'create')
        .mockResolvedValueOnce(mockBeverage);
      expect(await controller.create(dto)).toEqual(mockBeverage);
      expect(spy).toHaveBeenCalledWith(dto);
    });
  });

  describe('update', () => {
    it('should delegate to service', async () => {
      const payload = { id: 1, data: { stock: 30 } };
      const spy = jest
        .spyOn(service, 'update')
        .mockResolvedValueOnce({ ...mockBeverage, stock: 30 });
      const result = await controller.update(payload);
      expect(result.stock).toBe(30);
      expect(spy).toHaveBeenCalledWith(1, payload.data);
    });
  });

  describe('remove', () => {
    it('should delegate to service', async () => {
      const spy = jest
        .spyOn(service, 'remove')
        .mockResolvedValueOnce(mockBeverage);
      expect(await controller.remove(1)).toEqual(mockBeverage);
      expect(spy).toHaveBeenCalledWith(1);
    });
  });
});
