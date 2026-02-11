jest.mock('../suppliers', () => ({
  Supplier: class Supplier {},
}));
jest.mock('../movements', () => ({
  InventoryMovement: class InventoryMovement {},
}));

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RpcException } from '@nestjs/microservices';
import { of, throwError } from 'rxjs';
import { ItemsService, InventoryItem } from './';
import { NotificationsService } from '../notifications-service';
import {
  InventoryCategory,
  InventoryStatus,
} from '@app/contracts/inventory-service';
import {
  NotificationType,
  NotificationDto,
} from '@app/contracts/notifications-service';

const mockNotification: NotificationDto = {
  id: 1,
  type: NotificationType.INFO,
  title: 'Test',
  message: 'Test message',
  isRead: false,
  refId: 1,
  refType: 'inventory',
  userId: null,
  createdAt: new Date(),
};

describe('ItemsService', () => {
  let service: ItemsService;
  let repo: Record<string, jest.Mock>;
  let notificationsService: NotificationsService;

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
        ItemsService,
        {
          provide: getRepositoryToken(InventoryItem),
          useValue: repo,
        },
        {
          provide: NotificationsService,
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get(ItemsService);
    notificationsService = module.get(NotificationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return items with default order', async () => {
      const items = [mockItem];
      repo.find.mockResolvedValueOnce(items);

      const result = await service.findAll({});
      expect(result).toEqual(items);
      expect(repo.find).toHaveBeenCalledWith(
        expect.objectContaining({ where: {}, order: { name: 'ASC' } }),
      );
    });

    it('should apply filters', async () => {
      repo.find.mockResolvedValueOnce([]);
      const filters = { category: InventoryCategory.LINENS };

      await service.findAll(filters);
      expect(repo.find).toHaveBeenCalledWith(
        expect.objectContaining({ where: filters }),
      );
    });
  });

  describe('findOne', () => {
    it('should return an item by id', async () => {
      repo.findOne.mockResolvedValueOnce(mockItem);

      const result = await service.findOne(1);
      expect(result).toEqual(mockItem);
    });

    it('should throw RpcException when item not found', async () => {
      repo.findOne.mockResolvedValueOnce(null);

      await expect(service.findOne(999)).rejects.toThrow(RpcException);
    });
  });

  describe('create', () => {
    it('should create an item and return it', async () => {
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
      const created = { ...mockItem, ...dto, id: 2 };
      repo.create.mockReturnValueOnce(created);
      repo.save.mockResolvedValueOnce(created);

      const result = await service.create(dto);
      expect(result).toEqual(created);
      expect(repo.create).toHaveBeenCalledWith(dto);
    });

    it('should send LOW_STOCK notification on create', async () => {
      const dto = {
        name: 'Low Item',
        category: InventoryCategory.AMENITIES,
        currentStock: 5,
        minimumStock: 10,
        maximumStock: 100,
        unit: 'bottles',
        unitCost: 3.5,
        supplier: 'Supplier',
        location: 'Shelf 1',
      };
      const created = {
        ...mockItem,
        ...dto,
        id: 3,
        status: InventoryStatus.LOW_STOCK,
      };
      repo.create.mockReturnValueOnce(created);
      repo.save.mockResolvedValueOnce(created);
      const spy = jest
        .spyOn(notificationsService, 'create')
        .mockReturnValueOnce(of(mockNotification));

      await service.create(dto);
      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({
          type: NotificationType.WARNING,
          title: 'Low inventory',
          refType: 'inventory',
        }),
      );
    });

    it('should send OUT_OF_STOCK notification on create', async () => {
      const dto = {
        name: 'Empty Item',
        category: InventoryCategory.AMENITIES,
        currentStock: 0,
        minimumStock: 10,
        maximumStock: 100,
        unit: 'bottles',
        unitCost: 3.5,
        supplier: 'Supplier',
        location: 'Shelf 1',
      };
      const created = {
        ...mockItem,
        ...dto,
        id: 4,
        status: InventoryStatus.OUT_OF_STOCK,
      };
      repo.create.mockReturnValueOnce(created);
      repo.save.mockResolvedValueOnce(created);
      const spy = jest
        .spyOn(notificationsService, 'create')
        .mockReturnValueOnce(of(mockNotification));

      await service.create(dto);
      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({
          type: NotificationType.ALERT,
          title: 'Inventory out of stock',
        }),
      );
    });

    it('should handle notification error gracefully', async () => {
      const dto = {
        name: 'Empty Item',
        category: InventoryCategory.AMENITIES,
        currentStock: 0,
        minimumStock: 10,
        maximumStock: 100,
        unit: 'bottles',
        unitCost: 3.5,
        supplier: 'Supplier',
        location: 'Shelf 1',
      };
      const created = {
        ...mockItem,
        ...dto,
        id: 5,
        status: InventoryStatus.OUT_OF_STOCK,
      };
      repo.create.mockReturnValueOnce(created);
      repo.save.mockResolvedValueOnce(created);
      jest
        .spyOn(notificationsService, 'create')
        .mockReturnValueOnce(throwError(() => new Error('fail')));

      const result = await service.create(dto);
      expect(result).toEqual(created);
    });
  });

  describe('update', () => {
    it('should update an item', async () => {
      const updated = { ...mockItem, name: 'Updated' };
      repo.findOne.mockResolvedValueOnce(mockItem);
      repo.create.mockReturnValueOnce({ ...mockItem });
      repo.merge.mockReturnValueOnce(updated);
      repo.save.mockResolvedValueOnce(updated);

      const result = await service.update(1, { name: 'Updated' });
      expect(result.name).toBe('Updated');
    });

    it('should send recovery notification when status changes to AVAILABLE', async () => {
      const existing = {
        ...mockItem,
        status: InventoryStatus.LOW_STOCK,
      };
      const updated = {
        ...mockItem,
        currentStock: 100,
        status: InventoryStatus.AVAILABLE,
      };
      repo.findOne.mockResolvedValueOnce(existing);
      repo.create.mockReturnValueOnce({ ...existing });
      repo.merge.mockReturnValueOnce(updated);
      repo.save.mockResolvedValueOnce(updated);
      const spy = jest
        .spyOn(notificationsService, 'create')
        .mockReturnValueOnce(of(mockNotification));

      await service.update(1, { currentStock: 100 });
      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({
          type: NotificationType.INFO,
          title: 'Inventory recovered',
        }),
      );
    });

    it('should not send recovery notification when previous status was AVAILABLE', async () => {
      const updated = {
        ...mockItem,
        name: 'Same Status',
        status: InventoryStatus.AVAILABLE,
      };
      repo.findOne.mockResolvedValueOnce(mockItem);
      repo.create.mockReturnValueOnce({ ...mockItem });
      repo.merge.mockReturnValueOnce(updated);
      repo.save.mockResolvedValueOnce(updated);

      await service.update(1, { name: 'Same Status' });
      const spy = jest.spyOn(notificationsService, 'create');
      expect(spy).not.toHaveBeenCalled();
    });

    it('should send recovery notification when status changes from OUT_OF_STOCK to AVAILABLE', async () => {
      const existing = {
        ...mockItem,
        status: InventoryStatus.OUT_OF_STOCK,
      };
      const updated = {
        ...mockItem,
        currentStock: 50,
        status: InventoryStatus.AVAILABLE,
      };
      repo.findOne.mockResolvedValueOnce(existing);
      repo.create.mockReturnValueOnce({ ...existing });
      repo.merge.mockReturnValueOnce(updated);
      repo.save.mockResolvedValueOnce(updated);
      const spy = jest
        .spyOn(notificationsService, 'create')
        .mockReturnValueOnce(of(mockNotification));

      await service.update(1, { currentStock: 50 });
      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({
          type: NotificationType.INFO,
          title: 'Inventory recovered',
        }),
      );
    });

    it('should handle notification error on recovery', async () => {
      const existing = {
        ...mockItem,
        status: InventoryStatus.LOW_STOCK,
      };
      const updated = {
        ...mockItem,
        status: InventoryStatus.AVAILABLE,
      };
      repo.findOne.mockResolvedValueOnce(existing);
      repo.create.mockReturnValueOnce({ ...existing });
      repo.merge.mockReturnValueOnce(updated);
      repo.save.mockResolvedValueOnce(updated);
      jest
        .spyOn(notificationsService, 'create')
        .mockReturnValueOnce(throwError(() => new Error('fail')));

      const result = await service.update(1, { currentStock: 100 });
      expect(result).toEqual(updated);
    });

    it('should throw RpcException when updating non-existent item', async () => {
      repo.findOne.mockResolvedValueOnce(null);

      await expect(service.update(999, { name: 'X' })).rejects.toThrow(
        RpcException,
      );
    });
  });

  describe('remove', () => {
    it('should remove an item', async () => {
      repo.findOne.mockResolvedValueOnce(mockItem);
      repo.create.mockReturnValueOnce({ ...mockItem });
      repo.remove.mockResolvedValueOnce(mockItem);

      const result = await service.remove(1);
      expect(result).toEqual(mockItem);
    });

    it('should throw RpcException when removing non-existent item', async () => {
      repo.findOne.mockResolvedValueOnce(null);

      await expect(service.remove(999)).rejects.toThrow(RpcException);
    });
  });
});
