import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { newDb, DataType } from 'pg-mem';
import { of } from 'rxjs';
import { MovementsModule } from './movements.module';
import { MovementsService } from './movements.service';
import { InventoryMovement } from './entities/inventory-movement.entity';
import { InventoryItem } from '../items/entities/inventory-item.entity';
import { Supplier } from '../suppliers/entities/supplier.entity';
import { ItemsModule } from '../items/items.module';
import { ItemsService } from '../items/items.service';
import { NotificationsService } from '../notifications-service/notifications/notifications.service';
import {
  InventoryCategory,
  MovementType,
} from '@app/contracts/inventory-service';

describe('MovementsService (integration)', () => {
  let module: TestingModule;
  let service: MovementsService;
  let itemsService: ItemsService;
  let itemId: number;

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
            entities: [InventoryMovement, InventoryItem, Supplier],
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
        MovementsModule,
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

    service = module.get(MovementsService);
    itemsService = module.get(ItemsService);

    const item = await itemsService.create({
      name: 'Movement Test Item',
      category: InventoryCategory.CLEANING_SUPPLIES,
      currentStock: 50,
      minimumStock: 10,
      maximumStock: 100,
      unit: 'units',
      unitCost: 5.0,
      supplier: 'Test Supplier',
      location: 'Warehouse',
    });
    itemId = item.id;
  });

  afterAll(async () => {
    await module.close();
  });

  it('should create an IN movement and increase stock', async () => {
    const result = await service.create({
      type: MovementType.IN,
      inventoryId: itemId,
      quantity: 20,
      reason: 'Restocking',
      user: 'admin',
    });

    expect(result).toBeDefined();
    expect(result.id).toBeDefined();
    expect(result.previousStock).toBe(50);
    expect(result.newStock).toBe(70);
  });

  it('should create an OUT movement and decrease stock', async () => {
    const result = await service.create({
      type: MovementType.OUT,
      inventoryId: itemId,
      quantity: 10,
      reason: 'Room supply',
      user: 'housekeeping',
    });

    expect(result.previousStock).toBe(70);
    expect(result.newStock).toBe(60);
  });

  it('should reject OUT movement with insufficient stock', async () => {
    await expect(
      service.create({
        type: MovementType.OUT,
        inventoryId: itemId,
        quantity: 9999,
        reason: 'Too much',
        user: 'admin',
      }),
    ).rejects.toThrow();
  });

  it('should find all movements', async () => {
    const results = await service.findAll();
    expect(results.length).toBeGreaterThanOrEqual(2);
  });

  it('should throw 404 for non-existent inventory item', async () => {
    await expect(
      service.create({
        type: MovementType.IN,
        inventoryId: 99999,
        quantity: 1,
        reason: 'Invalid',
        user: 'admin',
      }),
    ).rejects.toThrow();
  });
});
