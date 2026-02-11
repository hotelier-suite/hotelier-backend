jest.mock('../items', () => ({
  InventoryItem: class InventoryItem {},
}));
jest.mock('../movements', () => ({
  InventoryMovement: class InventoryMovement {},
}));

import { Test, TestingModule } from '@nestjs/testing';
import { SuppliersController, SuppliersService } from './';

describe('SuppliersController', () => {
  let controller: SuppliersController;
  let service: SuppliersService;

  const mockSupplier = {
    id: 1,
    name: 'Linen Suppliers Inc',
    contact: 'Maria Gonzalez',
    email: 'contact@linensuppliers.com',
    phone: '+34 912 345 678',
    category: 'General',
    rating: 4.5,
    deliveryTime: '3-5 days',
    paymentTerms: '30 days',
    totalItems: 5,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SuppliersController],
      providers: [
        {
          provide: SuppliersService,
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

    controller = module.get(SuppliersController);
    service = module.get(SuppliersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all suppliers', async () => {
      const suppliers = [mockSupplier];
      jest.spyOn(service, 'findAll').mockResolvedValueOnce(suppliers);

      const result = await controller.findAll();
      expect(result).toEqual(suppliers);
    });
  });

  describe('findOne', () => {
    it('should return a supplier by id', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValueOnce(mockSupplier);

      const result = await controller.findOne(1);
      expect(result).toEqual(mockSupplier);
      const spy = jest.spyOn(service, 'findOne');
      expect(spy).toHaveBeenCalledWith(1);
    });
  });

  describe('create', () => {
    it('should create a supplier', async () => {
      const dto = {
        name: 'New Supplier',
        contact: 'John',
        email: 'john@supplier.com',
        phone: '+1 555 123',
        address: '123 Main St',
      };
      const spy = jest.spyOn(service, 'create').mockResolvedValueOnce({
        ...mockSupplier,
        ...dto,
        id: 2,
      });

      const result = await controller.create(dto);
      expect(result.name).toBe('New Supplier');
      expect(spy).toHaveBeenCalledWith(dto);
    });
  });

  describe('update', () => {
    it('should update a supplier', async () => {
      const payload = { id: 1, data: { name: 'Updated Supplier' } };
      const spy = jest
        .spyOn(service, 'update')
        .mockResolvedValueOnce({ ...mockSupplier, name: 'Updated Supplier' });

      const result = await controller.update(payload);
      expect(result.name).toBe('Updated Supplier');
      expect(spy).toHaveBeenCalledWith(1, {
        name: 'Updated Supplier',
      });
    });
  });

  describe('remove', () => {
    it('should remove a supplier', async () => {
      jest.spyOn(service, 'remove').mockResolvedValueOnce(mockSupplier);

      const result = await controller.remove(1);
      expect(result).toEqual(mockSupplier);
      const spy = jest.spyOn(service, 'remove');
      expect(spy).toHaveBeenCalledWith(1);
    });
  });
});
