import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { newDb, DataType } from 'pg-mem';
import { MenuItemsModule } from './menu-items.module';
import { MenuItemsService } from './menu-items.service';
import { MenuItem } from './entities/menu-item.entity';

describe('MenuItemsService (integration)', () => {
  let module: TestingModule;
  let service: MenuItemsService;

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
            entities: [MenuItem],
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
        MenuItemsModule,
      ],
    }).compile();

    service = module.get(MenuItemsService);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should create a menu item', async () => {
    const result = await service.create({
      category: 'Main Course',
      name: 'Grilled Salmon',
      price: 25.99,
      description: 'Fresh Atlantic salmon',
      ingredients: ['salmon', 'lemon', 'herbs'],
      allergens: ['fish'],
    });

    expect(result).toBeDefined();
    expect(result.id).toBeDefined();
    expect(result.name).toBe('Grilled Salmon');
    expect(result.price).toBe(25.99);
    expect(result.available).toBe(true);
  });

  it('should find all menu items', async () => {
    const results = await service.findAll();
    expect(results.length).toBeGreaterThanOrEqual(1);
  });

  it('should find menu item by id', async () => {
    const created = await service.create({
      category: 'Appetizer',
      name: 'Caesar Salad',
      price: 12.5,
    });

    const found = await service.findOne(created.id);
    expect(found.id).toBe(created.id);
    expect(found.name).toBe('Caesar Salad');
  });

  it('should update a menu item', async () => {
    const created = await service.create({
      category: 'Dessert',
      name: 'Chocolate Cake',
      price: 8.99,
    });

    const updated = await service.update(created.id, { price: 9.99 });
    expect(updated.price).toBe(9.99);
  });

  it('should remove a menu item', async () => {
    const created = await service.create({
      category: 'Beverage',
      name: 'Lemonade',
      price: 4.99,
    });

    const removed = await service.remove(created.id);
    expect(removed).toBeDefined();
  });

  it('should store json ingredients and allergens', async () => {
    const ingredients = ['flour', 'sugar', 'eggs'];
    const allergens = ['gluten', 'eggs'];

    const created = await service.create({
      category: 'Dessert',
      name: 'Croissant',
      price: 5.0,
      ingredients,
      allergens,
    });

    const found = await service.findOne(created.id);
    expect(found.ingredients).toEqual(ingredients);
    expect(found.allergens).toEqual(allergens);
  });
});
