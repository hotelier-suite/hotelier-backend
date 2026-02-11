jest.mock('../suppliers', () => ({
  Supplier: class Supplier {},
}));
jest.mock('../movements', () => ({
  InventoryMovement: class InventoryMovement {},
}));

import { Test, TestingModule } from '@nestjs/testing';
import { ItemsController, ItemsService } from './';
import {
  InventoryCategory,
  InventoryStatus,
} from '@app/contracts/inventory-service';

describe('ItemsController', () => {
  let controller: ItemsController;
  let service: ItemsService;

  const mockItem = {
    id: 1,
    name: 'Bed Sheets',
    category: InventoryCategory.LINENS,
    currentStock: 100,
    minimumStock: 20,
    maximumStock: 200,
    unit: 'pieces',
    unitCost: 25.5,
    supplier: 'Linen Supply Co',
    location: 'Storage A',
    status: InventoryStatus.AVAILABLE,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ItemsController],
      providers: [
        {
          provide: ItemsService,
          useValue: {
            findAll: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get(ItemsController);
    service = module.get(ItemsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all items', async () => {
      const items = [mockItem];
      const spy = jest.spyOn(service, 'findAll').mockResolvedValueOnce(items);

      const result = await controller.findAll({});
      expect(result).toEqual(items);
      expect(spy).toHaveBeenCalledWith({});
    });

    it('should pass filters to service', async () => {
      const filters = {
        category: InventoryCategory.LINENS,
        status: InventoryStatus.LOW_STOCK,
      };
      const spy = jest.spyOn(service, 'findAll').mockResolvedValueOnce([]);

      await controller.findAll(filters);
      expect(spy).toHaveBeenCalledWith(filters);
    });
  });

  describe('create', () => {
    it('should create an item', async () => {
      const dto = {
        name: 'New Item',
        category: InventoryCategory.AMENITIES,
        currentStock: 50,
        minimumStock: 10,
        maximumStock: 100,
        unit: 'bottles',
        unitCost: 3.5,
        supplier: 'Supplier',
        location: 'Shelf 1',
      };
      const spy = jest.spyOn(service, 'create').mockResolvedValueOnce({
        ...mockItem,
        ...dto,
        id: 2,
      });

      const result = await controller.create(dto);
      expect(result.name).toBe('New Item');
      expect(spy).toHaveBeenCalledWith(dto);
    });
  });

  describe('update', () => {
    it('should update an item', async () => {
      const payload = { id: 1, data: { name: 'Updated' } };
      const spy = jest
        .spyOn(service, 'update')
        .mockResolvedValueOnce({ ...mockItem, name: 'Updated' });

      const result = await controller.update(payload);
      expect(result.name).toBe('Updated');
      expect(spy).toHaveBeenCalledWith(1, { name: 'Updated' });
    });
  });

  describe('remove', () => {
    it('should remove an item', async () => {
      jest.spyOn(service, 'remove').mockResolvedValueOnce(mockItem);

      const result = await controller.remove(1);
      expect(result).toEqual(mockItem);
      const spy = jest.spyOn(service, 'remove');
      expect(spy).toHaveBeenCalledWith(1);
    });
  });
});
