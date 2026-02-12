import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { newDb, DataType } from 'pg-mem';
import { BeverageInventoryModule } from './beverage-inventory.module';
import { BeverageInventoryService } from './beverage-inventory.service';
import { BeverageInventory } from './entities/beverage-inventory.entity';
import { BeverageStatus } from '@app/contracts/restaurant-service';

describe('BeverageInventoryService (integration)', () => {
  let module: TestingModule;
  let service: BeverageInventoryService;

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
            entities: [BeverageInventory],
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
        BeverageInventoryModule,
      ],
    }).compile();

    service = module.get(BeverageInventoryService);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should create a beverage item', async () => {
    const result = await service.create({
      name: 'Orange Juice',
      category: 'Juice',
      stock: 50,
      minimumStock: 10,
      unit: 'liters',
      unitCost: 3.5,
    });

    expect(result).toBeDefined();
    expect(result.id).toBeDefined();
    expect(result.name).toBe('Orange Juice');
    expect(result.status).toBe(BeverageStatus.AVAILABLE);
  });

  it('should auto-calculate LOW_STOCK status', async () => {
    const result = await service.create({
      name: 'Sparkling Water',
      category: 'Water',
      stock: 5,
      minimumStock: 10,
      unit: 'bottles',
      unitCost: 1.5,
    });

    expect(result.status).toBe(BeverageStatus.LOW_STOCK);
  });

  it('should auto-calculate OUT_OF_STOCK status', async () => {
    const result = await service.create({
      name: 'Champagne',
      category: 'Wine',
      stock: 0,
      minimumStock: 5,
      unit: 'bottles',
      unitCost: 45.0,
    });

    expect(result.status).toBe(BeverageStatus.OUT_OF_STOCK);
  });

  it('should find all beverages', async () => {
    const results = await service.findAll({});
    expect(results.length).toBeGreaterThanOrEqual(3);
  });

  it('should find beverage by id', async () => {
    const created = await service.create({
      name: 'Cola',
      category: 'Soft Drink',
      stock: 100,
      minimumStock: 20,
      unit: 'cans',
      unitCost: 1.0,
    });

    const found = await service.findOne(created.id);
    expect(found.id).toBe(created.id);
    expect(found.name).toBe('Cola');
  });

  it('should update a beverage item', async () => {
    const created = await service.create({
      name: 'Beer',
      category: 'Alcohol',
      stock: 30,
      minimumStock: 10,
      unit: 'bottles',
      unitCost: 5.0,
    });

    const updated = await service.update(created.id, { stock: 5 });
    expect(updated.stock).toBe(5);
    expect(updated.status).toBe(BeverageStatus.LOW_STOCK);
  });

  it('should remove a beverage item', async () => {
    const created = await service.create({
      name: 'To Remove',
      category: 'Other',
      stock: 10,
      minimumStock: 5,
      unit: 'units',
      unitCost: 2.0,
    });

    const removed = await service.remove(created.id);
    expect(removed).toBeDefined();
  });
});
