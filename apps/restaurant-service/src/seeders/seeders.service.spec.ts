import { Test, TestingModule } from '@nestjs/testing';
import { SeedersService } from './seeders.service';
import {
  MenuItemsSeeder,
  RoomServiceOrdersSeeder,
  BeverageInventorySeeder,
} from './domains';

describe('SeedersService', () => {
  let service: SeedersService;
  let menuSeeder: MenuItemsSeeder;
  let orderSeeder: RoomServiceOrdersSeeder;
  let bevSeeder: BeverageInventorySeeder;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SeedersService,
        {
          provide: MenuItemsSeeder,
          useValue: { seed: jest.fn().mockResolvedValue(undefined) },
        },
        {
          provide: RoomServiceOrdersSeeder,
          useValue: { seed: jest.fn().mockResolvedValue(undefined) },
        },
        {
          provide: BeverageInventorySeeder,
          useValue: { seed: jest.fn().mockResolvedValue(undefined) },
        },
      ],
    }).compile();

    service = module.get(SeedersService);
    menuSeeder = module.get(MenuItemsSeeder);
    orderSeeder = module.get(RoomServiceOrdersSeeder);
    bevSeeder = module.get(BeverageInventorySeeder);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call all seeders', async () => {
    const menuSpy = jest.spyOn(menuSeeder, 'seed');
    const orderSpy = jest.spyOn(orderSeeder, 'seed');
    const bevSpy = jest.spyOn(bevSeeder, 'seed');

    await service.seed();
    expect(menuSpy).toHaveBeenCalled();
    expect(orderSpy).toHaveBeenCalled();
    expect(bevSpy).toHaveBeenCalled();
  });
});
