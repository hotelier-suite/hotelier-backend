import { Test, TestingModule } from '@nestjs/testing';
import { MenuItemsController } from './menu-items.controller';
import { MenuItemsService } from './menu-items.service';

describe('MenuItemsController', () => {
  let controller: MenuItemsController;
  let service: MenuItemsService;

  const mockItem = {
    id: 1,
    itemCode: 'MAIN001',
    category: 'Main Courses',
    name: 'Grilled Salmon',
    description: 'Fresh salmon',
    price: 28.5,
    available: true,
    preparationTime: '20 minutes',
    ingredients: ['salmon'],
    allergens: ['fish'],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MenuItemsController],
      providers: [
        {
          provide: MenuItemsService,
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

    controller = module.get(MenuItemsController);
    service = module.get(MenuItemsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all menu items', async () => {
      const spy = jest
        .spyOn(service, 'findAll')
        .mockResolvedValueOnce([mockItem]);
      expect(await controller.findAll()).toEqual([mockItem]);
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a menu item by id', async () => {
      const spy = jest
        .spyOn(service, 'findOne')
        .mockResolvedValueOnce(mockItem);
      expect(await controller.findOne(1)).toEqual(mockItem);
      expect(spy).toHaveBeenCalledWith(1);
    });
  });

  describe('create', () => {
    it('should create a menu item', async () => {
      const dto = { category: 'Appetizers', name: 'Bruschetta', price: 12.5 };
      const spy = jest.spyOn(service, 'create').mockResolvedValueOnce(mockItem);
      expect(await controller.create(dto)).toEqual(mockItem);
      expect(spy).toHaveBeenCalledWith(dto);
    });
  });

  describe('update', () => {
    it('should update a menu item', async () => {
      const payload = { id: 1, data: { price: 30 } };
      const spy = jest
        .spyOn(service, 'update')
        .mockResolvedValueOnce({ ...mockItem, price: 30 });
      const result = await controller.update(payload);
      expect(result.price).toBe(30);
      expect(spy).toHaveBeenCalledWith(1, payload.data);
    });
  });

  describe('remove', () => {
    it('should remove a menu item', async () => {
      const spy = jest.spyOn(service, 'remove').mockResolvedValueOnce(mockItem);
      expect(await controller.remove(1)).toEqual(mockItem);
      expect(spy).toHaveBeenCalledWith(1);
    });
  });
});
