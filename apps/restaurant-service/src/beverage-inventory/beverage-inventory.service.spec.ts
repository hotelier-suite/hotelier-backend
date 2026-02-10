import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RpcException } from '@nestjs/microservices';
import { BeverageInventoryService } from './beverage-inventory.service';
import { BeverageInventory } from './entities';
import { BeverageStatus } from '@app/contracts/restaurant-service';

describe('BeverageInventoryService', () => {
  let service: BeverageInventoryService;
  let repo: Record<string, jest.Mock>;

  const mockBeverage = {
    id: 1,
    itemCode: 'ALC001',
    name: 'Red Wine',
    category: 'Wine',
    stock: 24,
    minimumStock: 6,
    unit: 'bottles',
    unitCost: 25,
    status: BeverageStatus.AVAILABLE,
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
        BeverageInventoryService,
        { provide: getRepositoryToken(BeverageInventory), useValue: repo },
      ],
    }).compile();

    service = module.get(BeverageInventoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all beverages with no filters', async () => {
      repo.find.mockResolvedValueOnce([mockBeverage]);
      const result = await service.findAll({});
      expect(result).toEqual([mockBeverage]);
    });

    it('should filter by lowStock', async () => {
      repo.find.mockResolvedValueOnce([]);
      await service.findAll({ lowStock: true });
      expect(repo.find).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { status: BeverageStatus.LOW_STOCK },
        }),
      );
    });

    it('should filter by category', async () => {
      repo.find.mockResolvedValueOnce([]);
      await service.findAll({ category: 'Wine' });
      expect(repo.find).toHaveBeenCalledWith(
        expect.objectContaining({ where: { category: 'Wine' } }),
      );
    });
  });

  describe('findOne', () => {
    it('should return a beverage item', async () => {
      repo.findOne.mockResolvedValueOnce(mockBeverage);
      const result = await service.findOne(1);
      expect(result).toEqual(mockBeverage);
    });

    it('should throw RpcException when not found', async () => {
      repo.findOne.mockResolvedValueOnce(null);
      await expect(service.findOne(999)).rejects.toThrow(RpcException);
    });
  });

  describe('create', () => {
    it('should create and save a beverage item', async () => {
      const dto = {
        name: 'Red Wine',
        category: 'Wine',
        stock: 24,
        minimumStock: 6,
        unit: 'bottles',
        unitCost: 25,
      };
      repo.create.mockReturnValue(dto);
      repo.save.mockResolvedValueOnce({ id: 1, ...dto });
      const result = await service.create(dto);
      expect(result).toHaveProperty('id', 1);
    });
  });

  describe('update', () => {
    it('should update an existing beverage', async () => {
      repo.findOne.mockResolvedValueOnce(mockBeverage);
      repo.create.mockReturnValue(mockBeverage);
      const merged = { ...mockBeverage, stock: 30 };
      repo.merge.mockReturnValue(merged);
      repo.save.mockResolvedValueOnce(merged);
      const result = await service.update(1, { stock: 30 });
      expect(result.stock).toBe(30);
    });

    it('should throw when not found', async () => {
      repo.findOne.mockResolvedValueOnce(null);
      await expect(service.update(999, {})).rejects.toThrow(RpcException);
    });
  });

  describe('remove', () => {
    it('should remove a beverage', async () => {
      repo.findOne.mockResolvedValueOnce(mockBeverage);
      repo.create.mockReturnValue(mockBeverage);
      repo.remove.mockResolvedValueOnce(mockBeverage);
      const result = await service.remove(1);
      expect(result).toEqual(mockBeverage);
    });

    it('should throw when not found', async () => {
      repo.findOne.mockResolvedValueOnce(null);
      await expect(service.remove(999)).rejects.toThrow(RpcException);
    });
  });
});
