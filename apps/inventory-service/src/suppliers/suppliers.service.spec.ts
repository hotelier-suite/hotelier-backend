jest.mock('../items', () => ({
  InventoryItem: class InventoryItem {},
}));
jest.mock('../movements', () => ({
  InventoryMovement: class InventoryMovement {},
}));

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RpcException } from '@nestjs/microservices';
import { SuppliersService, Supplier } from './';

describe('SuppliersService', () => {
  let service: SuppliersService;
  let repo: Record<string, jest.Mock>;

  const mockSupplier = {
    id: 1,
    name: 'Linen Suppliers Inc',
    contact: 'Maria Gonzalez',
    email: 'contact@linensuppliers.com',
    phone: '+34 912 345 678',
    address: '123 Main Street',
    category: 'General',
    rating: 4.5,
    deliveryTime: '3-5 days',
    paymentTerms: '30 days',
    createdAt: new Date(),
    updatedAt: new Date(),
    inventoryItems: [{ id: 1 }, { id: 2 }],
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
        SuppliersService,
        {
          provide: getRepositoryToken(Supplier),
          useValue: repo,
        },
      ],
    }).compile();

    service = module.get(SuppliersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return suppliers with totalItems count', async () => {
      repo.find.mockResolvedValueOnce([mockSupplier]);

      const result = await service.findAll();
      expect(result).toHaveLength(1);
      expect(result[0].totalItems).toBe(2);
      expect(result[0]).not.toHaveProperty('inventoryItems');
    });

    it('should return 0 totalItems when no inventory items', async () => {
      repo.find.mockResolvedValueOnce([
        { ...mockSupplier, inventoryItems: undefined },
      ]);

      const result = await service.findAll();
      expect(result[0].totalItems).toBe(0);
    });

    it('should order by name ASC', async () => {
      repo.find.mockResolvedValueOnce([]);

      await service.findAll();
      expect(repo.find).toHaveBeenCalledWith(
        expect.objectContaining({ order: { name: 'ASC' } }),
      );
    });
  });

  describe('findOne', () => {
    it('should return a supplier with totalItems', async () => {
      repo.findOne.mockResolvedValueOnce(mockSupplier);

      const result = await service.findOne(1);
      expect(result.totalItems).toBe(2);
      expect(result.name).toBe('Linen Suppliers Inc');
    });

    it('should throw RpcException when not found', async () => {
      repo.findOne.mockResolvedValueOnce(null);

      await expect(service.findOne(999)).rejects.toThrow(RpcException);
    });
  });

  describe('create', () => {
    it('should create a supplier', async () => {
      const dto = {
        name: 'New Supplier',
        contact: 'John',
        email: 'john@supplier.com',
        phone: '+1 555 123',
        address: '456 Oak Ave',
      };
      const created = { ...dto, id: 2 };
      repo.create.mockReturnValueOnce(created);
      repo.save.mockResolvedValueOnce(created);

      const result = await service.create(dto);
      expect(result).toEqual(created);
      expect(repo.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('update', () => {
    it('should update a supplier', async () => {
      repo.findOne.mockResolvedValueOnce(mockSupplier);
      const existing = { ...mockSupplier, totalItems: 2 };
      repo.create.mockReturnValueOnce({ ...existing });
      repo.merge.mockReturnValueOnce({
        ...existing,
        name: 'Updated',
      });
      repo.save.mockResolvedValueOnce({
        ...existing,
        name: 'Updated',
      });

      const result = await service.update(1, { name: 'Updated' });
      expect(result.name).toBe('Updated');
    });

    it('should throw RpcException when updating non-existent supplier', async () => {
      repo.findOne.mockResolvedValueOnce(null);

      await expect(service.update(999, { name: 'X' })).rejects.toThrow(
        RpcException,
      );
    });
  });

  describe('remove', () => {
    it('should remove a supplier with no inventory items', async () => {
      const supplierNoItems = {
        ...mockSupplier,
        inventoryItems: [],
      };
      repo.findOne.mockResolvedValueOnce(supplierNoItems);
      repo.create.mockReturnValueOnce({ ...supplierNoItems, totalItems: 0 });
      repo.remove.mockResolvedValueOnce(supplierNoItems);

      const result = await service.remove(1);
      expect(result).toBeDefined();
    });

    it('should throw RpcException when supplier has inventory items', async () => {
      repo.findOne.mockResolvedValueOnce(mockSupplier);

      await expect(service.remove(1)).rejects.toThrow(RpcException);
    });

    it('should throw RpcException when supplier not found', async () => {
      repo.findOne.mockResolvedValueOnce(null);

      await expect(service.remove(999)).rejects.toThrow(RpcException);
    });
  });
});
