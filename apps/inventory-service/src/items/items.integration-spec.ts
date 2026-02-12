import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { newDb, DataType } from 'pg-mem';
import { of } from 'rxjs';
import { ItemsModule } from './items.module';
import { ItemsService } from './items.service';
import { InventoryItem } from './entities/inventory-item.entity';
import { Supplier } from '../suppliers/entities/supplier.entity';
import { InventoryMovement } from '../movements/entities/inventory-movement.entity';
import { NotificationsService } from '../notifications-service/notifications/notifications.service';
import {
  InventoryCategory,
  InventoryStatus,
} from '@app/contracts/inventory-service';

describe('ItemsService (integration)', () => {
  let module: TestingModule;
  let service: ItemsService;

  beforeAll(async () => {
    const db = newDb({ autoCreateForeignKeyIndices: true });
    db.public.registerFunction({
      name: 'current_database',
      returns: DataType.text,
      implementation: () => 'test',
    });
    db.public.registerFunction({
      name: 'version',
      returns: DataType.text,
      implementation: () => 'PostgreSQL 18.0 (pg-mem)',
    });

    module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRootAsync({
          useFactory: (): TypeOrmModuleOptions => ({
            type: 'postgres',
            entities: [InventoryItem, Supplier, InventoryMovement],
          }),
          dataSourceFactory: async (options) => {
            const ds = db.adapters.createTypeormDataSource(
              options,
            ) as DataSource;
            await ds.initialize();
            await ds.synchronize();
            return ds;
          },
        }),
        ItemsModule,
        {
          module: class MockNotifications {},
          global: true,
          providers: [
            {
              provide: NotificationsService,
              useValue: { create: jest.fn().mockReturnValue(of({})) },
            },
          ],
          exports: [NotificationsService],
        },
      ],
    }).compile();

    service = module.get(ItemsService);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should create an inventory item', async () => {
    const result = await service.create({
      name: 'Bath Towels',
      category: InventoryCategory.LINENS,
      currentStock: 100,
      minimumStock: 20,
      maximumStock: 200,
      unit: 'pieces',
      unitCost: 5.5,
      supplier: 'Towel Co',
      location: 'Storage Room A',
    });

    expect(result).toBeDefined();
    expect(result.id).toBeDefined();
    expect(result.name).toBe('Bath Towels');
    expect(result.status).toBe(InventoryStatus.AVAILABLE);
  });

  it('should auto-set LOW_STOCK status', async () => {
    const result = await service.create({
      name: 'Shampoo',
      category: InventoryCategory.AMENITIES,
      currentStock: 5,
      minimumStock: 10,
      maximumStock: 100,
      unit: 'bottles',
      unitCost: 2.0,
      supplier: 'Amenity Corp',
      location: 'Storage Room B',
    });

    expect(result.status).toBe(InventoryStatus.LOW_STOCK);
  });

  it('should auto-set OUT_OF_STOCK status', async () => {
    const result = await service.create({
      name: 'Hand Soap',
      category: InventoryCategory.AMENITIES,
      currentStock: 0,
      minimumStock: 10,
      maximumStock: 50,
      unit: 'bottles',
      unitCost: 1.5,
      supplier: 'Amenity Corp',
      location: 'Storage Room B',
    });

    expect(result.status).toBe(InventoryStatus.OUT_OF_STOCK);
  });

  it('should find all items', async () => {
    const results = await service.findAll({});
    expect(results.length).toBeGreaterThanOrEqual(3);
  });

  it('should filter items by category', async () => {
    const results = await service.findAll({
      category: InventoryCategory.AMENITIES,
    });
    results.forEach((item) =>
      expect(item.category).toBe(InventoryCategory.AMENITIES),
    );
  });

  it('should find item by id', async () => {
    const created = await service.create({
      name: 'Cleaning Spray',
      category: InventoryCategory.CLEANING_SUPPLIES,
      currentStock: 50,
      minimumStock: 10,
      maximumStock: 100,
      unit: 'cans',
      unitCost: 3.0,
      supplier: 'Clean Co',
      location: 'Janitorial Closet',
    });

    const found = await service.findOne(created.id);
    expect(found.id).toBe(created.id);
  });

  it('should update an item', async () => {
    const created = await service.create({
      name: 'Pillowcases',
      category: InventoryCategory.LINENS,
      currentStock: 80,
      minimumStock: 20,
      maximumStock: 150,
      unit: 'pieces',
      unitCost: 4.0,
      supplier: 'Linen Corp',
      location: 'Storage Room A',
    });

    const updated = await service.update(created.id, {
      currentStock: 15,
    });
    expect(updated.status).toBe(InventoryStatus.LOW_STOCK);
  });

  it('should remove an item', async () => {
    const created = await service.create({
      name: 'To Remove',
      category: InventoryCategory.OFFICE_SUPPLIES,
      currentStock: 10,
      minimumStock: 5,
      maximumStock: 50,
      unit: 'packs',
      unitCost: 8.0,
      supplier: 'Office Co',
      location: 'Office',
    });

    const removed = await service.remove(created.id);
    expect(removed).toBeDefined();
  });
});
