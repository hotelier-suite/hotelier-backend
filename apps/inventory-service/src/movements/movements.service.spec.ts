jest.mock('../items', () => ({
  InventoryItem: class InventoryItem {},
}));

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RpcException } from '@nestjs/microservices';
import { MovementsService, InventoryMovement } from './';
import { InventoryItem } from '../items';
import {
  MovementType,
  InventoryStatus,
} from '@app/contracts/inventory-service';

describe('MovementsService', () => {
  let service: MovementsService;
  let movementRepo: Record<string, jest.Mock>;
  let itemRepo: Record<string, jest.Mock>;

  const mockItem = {
    id: 1,
    name: 'Sheets',
    currentStock: 50,
    minimumStock: 20,
    maximumStock: 200,
    status: InventoryStatus.AVAILABLE,
  };

  const mockMovement = {
    id: 1,
    type: MovementType.IN,
    inventoryId: 1,
    quantity: 10,
    previousStock: 50,
    newStock: 60,
    reason: 'Restocking',
    cost: 250.0,
    user: 'admin',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    movementRepo = {
      find: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };
    itemRepo = {
      findOne: jest.fn(),
      update: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MovementsService,
        {
          provide: getRepositoryToken(InventoryMovement),
          useValue: movementRepo,
        },
        {
          provide: getRepositoryToken(InventoryItem),
          useValue: itemRepo,
        },
      ],
    }).compile();

    service = module.get(MovementsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all movements with relations', async () => {
      const movements = [mockMovement];
      movementRepo.find.mockResolvedValueOnce(movements);

      const result = await service.findAll();
      expect(result).toEqual(movements);
      expect(movementRepo.find).toHaveBeenCalledWith(
        expect.objectContaining({
          relations: { inventory: true },
          order: { createdAt: 'DESC' },
        }),
      );
    });
  });

  describe('create', () => {
    it('should create an IN movement and update stock', async () => {
      const dto = {
        type: MovementType.IN,
        inventoryId: 1,
        quantity: 10,
        reason: 'Restocking',
        cost: 250.0,
        user: 'admin',
      };
      itemRepo.findOne.mockResolvedValueOnce({ ...mockItem });
      movementRepo.create.mockReturnValueOnce({
        ...mockMovement,
        ...dto,
        previousStock: 50,
        newStock: 60,
      });
      movementRepo.save.mockResolvedValueOnce({
        ...mockMovement,
        ...dto,
        previousStock: 50,
        newStock: 60,
      });
      itemRepo.update.mockResolvedValueOnce({});

      const result = await service.create(dto);
      expect(result.previousStock).toBe(50);
      expect(result.newStock).toBe(60);
      expect(itemRepo.update).toHaveBeenCalledWith(1, {
        currentStock: 60,
        status: InventoryStatus.AVAILABLE,
      });
    });

    it('should create an OUT movement and update stock', async () => {
      const dto = {
        type: MovementType.OUT,
        inventoryId: 1,
        quantity: 5,
        reason: 'Used for rooms',
        user: 'housekeeping',
      };
      itemRepo.findOne.mockResolvedValueOnce({ ...mockItem });
      movementRepo.create.mockReturnValueOnce({
        ...mockMovement,
        ...dto,
        previousStock: 50,
        newStock: 45,
      });
      movementRepo.save.mockResolvedValueOnce({
        ...mockMovement,
        ...dto,
        previousStock: 50,
        newStock: 45,
      });
      itemRepo.update.mockResolvedValueOnce({});

      const result = await service.create(dto);
      expect(result.newStock).toBe(45);
      expect(itemRepo.update).toHaveBeenCalledWith(1, {
        currentStock: 45,
        status: InventoryStatus.AVAILABLE,
      });
    });

    it('should throw RpcException when item not found', async () => {
      const dto = {
        type: MovementType.IN,
        inventoryId: 999,
        quantity: 10,
        reason: 'Restocking',
        user: 'admin',
      };
      itemRepo.findOne.mockResolvedValueOnce(null);

      await expect(service.create(dto)).rejects.toThrow(RpcException);
    });

    it('should throw RpcException on insufficient stock', async () => {
      const dto = {
        type: MovementType.OUT,
        inventoryId: 1,
        quantity: 100,
        reason: 'Large withdrawal',
        user: 'admin',
      };
      itemRepo.findOne.mockResolvedValueOnce({
        ...mockItem,
        currentStock: 50,
      });

      await expect(service.create(dto)).rejects.toThrow(RpcException);
    });

    it('should set LOW_STOCK status when stock drops to minimum', async () => {
      const dto = {
        type: MovementType.OUT,
        inventoryId: 1,
        quantity: 30,
        reason: 'Usage',
        user: 'admin',
      };
      itemRepo.findOne.mockResolvedValueOnce({ ...mockItem });
      movementRepo.create.mockReturnValueOnce({
        ...mockMovement,
        previousStock: 50,
        newStock: 20,
      });
      movementRepo.save.mockResolvedValueOnce({
        ...mockMovement,
        previousStock: 50,
        newStock: 20,
      });
      itemRepo.update.mockResolvedValueOnce({});

      await service.create(dto);
      expect(itemRepo.update).toHaveBeenCalledWith(1, {
        currentStock: 20,
        status: InventoryStatus.LOW_STOCK,
      });
    });

    it('should set OUT_OF_STOCK status when stock reaches 0', async () => {
      const dto = {
        type: MovementType.OUT,
        inventoryId: 1,
        quantity: 50,
        reason: 'Clear stock',
        user: 'admin',
      };
      itemRepo.findOne.mockResolvedValueOnce({ ...mockItem });
      movementRepo.create.mockReturnValueOnce({
        ...mockMovement,
        previousStock: 50,
        newStock: 0,
      });
      movementRepo.save.mockResolvedValueOnce({
        ...mockMovement,
        previousStock: 50,
        newStock: 0,
      });
      itemRepo.update.mockResolvedValueOnce({});

      await service.create(dto);
      expect(itemRepo.update).toHaveBeenCalledWith(1, {
        currentStock: 0,
        status: InventoryStatus.OUT_OF_STOCK,
      });
    });

    it('should handle null cost', async () => {
      const dto = {
        type: MovementType.IN,
        inventoryId: 1,
        quantity: 5,
        reason: 'Donation',
        user: 'admin',
      };
      itemRepo.findOne.mockResolvedValueOnce({ ...mockItem });
      movementRepo.create.mockReturnValueOnce({
        ...mockMovement,
        cost: null,
        previousStock: 50,
        newStock: 55,
      });
      movementRepo.save.mockResolvedValueOnce({
        ...mockMovement,
        cost: null,
        previousStock: 50,
        newStock: 55,
      });
      itemRepo.update.mockResolvedValueOnce({});

      const result = await service.create(dto);
      expect(result.cost).toBeNull();
    });
  });
});
