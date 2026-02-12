import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { newDb, DataType } from 'pg-mem';
import { SuppliersModule } from './suppliers.module';
import { SuppliersService } from './suppliers.service';
import { Supplier } from './entities/supplier.entity';
import { InventoryItem } from '../items/entities/inventory-item.entity';
import { InventoryMovement } from '../movements/entities/inventory-movement.entity';

describe('SuppliersService (integration)', () => {
  let module: TestingModule;
  let service: SuppliersService;

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
            entities: [Supplier, InventoryItem, InventoryMovement],
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
        SuppliersModule,
      ],
    }).compile();

    service = module.get(SuppliersService);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should create a supplier', async () => {
    const result = await service.create({
      name: 'Clean Supplies Co',
      contact: 'John Doe',
      email: 'john@cleansupplies.com',
      phone: '+1234567890',
      address: '123 Supplier St',
    });

    expect(result).toBeDefined();
    expect(result.id).toBeDefined();
    expect(result.name).toBe('Clean Supplies Co');
  });

  it('should find all suppliers', async () => {
    const results = await service.findAll();
    expect(results.length).toBeGreaterThanOrEqual(1);
  });

  it('should find supplier by id', async () => {
    const created = await service.create({
      name: 'Hotel Linens Inc',
      contact: 'Jane Smith',
      email: 'jane@hotellinens.com',
      phone: '+9876543210',
      address: '456 Fabric Ave',
    });

    const found = await service.findOne(created.id);
    expect(found.id).toBe(created.id);
    expect(found.name).toBe('Hotel Linens Inc');
  });

  it('should update a supplier', async () => {
    const created = await service.create({
      name: 'Old Name',
      contact: 'Contact',
      email: 'old@test.com',
      phone: '+1111111111',
      address: '789 Old Rd',
    });

    const updated = await service.update(created.id, {
      name: 'New Name',
    });
    expect(updated.name).toBe('New Name');
  });

  it('should remove a supplier without items', async () => {
    const created = await service.create({
      name: 'To Remove',
      contact: 'Del Contact',
      email: 'del@test.com',
      phone: '+2222222222',
      address: '999 Remove Ln',
    });

    const removed = await service.remove(created.id);
    expect(removed).toBeDefined();
  });

  it('should throw 404 for non-existent supplier', async () => {
    await expect(service.findOne(99999)).rejects.toThrow();
  });
});
