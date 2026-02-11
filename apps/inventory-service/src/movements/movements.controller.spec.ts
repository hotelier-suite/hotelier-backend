jest.mock('../items', () => ({
  InventoryItem: class InventoryItem {},
}));

import { Test, TestingModule } from '@nestjs/testing';
import { MovementsController, MovementsService } from './';
import { MovementType } from '@app/contracts/inventory-service';

describe('MovementsController', () => {
  let controller: MovementsController;
  let service: MovementsService;

  const mockMovement = {
    id: 1,
    type: MovementType.IN,
    inventoryId: 1,
    quantity: 10,
    previousStock: 50,
    newStock: 60,
    reason: 'Restocking',
    cost: 250.0,
    user: 'admin',
    responsible: 'John Smith',
    notes: 'Weekly order',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MovementsController],
      providers: [
        {
          provide: MovementsService,
          useValue: {
            findAll: jest.fn(),
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get(MovementsController);
    service = module.get(MovementsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all movements', async () => {
      const movements = [mockMovement];
      jest.spyOn(service, 'findAll').mockResolvedValueOnce(movements);

      const result = await controller.findAll();
      expect(result).toEqual(movements);
    });
  });

  describe('create', () => {
    it('should create a movement', async () => {
      const dto = {
        type: MovementType.IN,
        inventoryId: 1,
        quantity: 10,
        reason: 'Restocking',
        cost: 250.0,
        user: 'admin',
      };
      jest.spyOn(service, 'create').mockResolvedValueOnce(mockMovement);

      const result = await controller.create(dto);
      expect(result).toEqual(mockMovement);
      const spy = jest.spyOn(service, 'create');
      expect(spy).toHaveBeenCalledWith(dto);
    });
  });
});
