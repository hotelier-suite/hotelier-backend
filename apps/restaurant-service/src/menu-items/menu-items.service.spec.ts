import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RpcException } from '@nestjs/microservices';
import { MenuItemsService } from './menu-items.service';
import { MenuItem } from './entities';

describe('MenuItemsService', () => {
  let service: MenuItemsService;
  let repo: Record<string, jest.Mock>;

  const mockItem = {
    id: 1,
    itemCode: 'MAIN001',
    category: 'Main Courses',
    name: 'Grilled Salmon',
    price: 28.5,
    available: true,
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
        MenuItemsService,
        { provide: getRepositoryToken(MenuItem), useValue: repo },
      ],
    }).compile();

    service = module.get(MenuItemsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all menu items', async () => {
      repo.find.mockResolvedValueOnce([mockItem]);
      const result = await service.findAll();
      expect(result).toEqual([mockItem]);
      expect(repo.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a menu item by id', async () => {
      repo.findOne.mockResolvedValueOnce(mockItem);
      const result = await service.findOne(1);
      expect(result).toEqual(mockItem);
    });

    it('should throw RpcException when not found', async () => {
      repo.findOne.mockResolvedValueOnce(null);
      await expect(service.findOne(999)).rejects.toThrow(RpcException);
    });
  });

  describe('create', () => {
    it('should create and save a menu item', async () => {
      const dto = { category: 'Appetizers', name: 'Bruschetta', price: 12.5 };
      repo.create.mockReturnValue(dto);
      repo.save.mockResolvedValueOnce({ id: 1, ...dto });
      const result = await service.create(dto);
      expect(result).toHaveProperty('id', 1);
    });
  });

  describe('update', () => {
    it('should update an existing item', async () => {
      repo.findOne.mockResolvedValueOnce(mockItem);
      repo.create.mockReturnValue(mockItem);
      const merged = { ...mockItem, price: 30 };
      repo.merge.mockReturnValue(merged);
      repo.save.mockResolvedValueOnce(merged);
      const result = await service.update(1, { price: 30 });
      expect(result.price).toBe(30);
    });

    it('should throw when not found', async () => {
      repo.findOne.mockResolvedValueOnce(null);
      await expect(service.update(999, {})).rejects.toThrow(RpcException);
    });
  });

  describe('remove', () => {
    it('should remove an item', async () => {
      repo.findOne.mockResolvedValueOnce(mockItem);
      repo.create.mockReturnValue(mockItem);
      repo.remove.mockResolvedValueOnce(mockItem);
      const result = await service.remove(1);
      expect(result).toEqual(mockItem);
    });

    it('should throw when not found', async () => {
      repo.findOne.mockResolvedValueOnce(null);
      await expect(service.remove(999)).rejects.toThrow(RpcException);
    });
  });
});
