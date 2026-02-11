jest.mock('../reservations', () => ({
  Reservation: class Reservation {},
}));

import { Test, TestingModule } from '@nestjs/testing';
import { GuestsController, GuestsService } from './';

describe('GuestsController', () => {
  let controller: GuestsController;
  let service: GuestsService;

  const mockGuest = {
    id: 1,
    name: 'John Smith',
    email: 'john@example.com',
    phone: '+1234567890',
    document: 'ABC123',
    vip: false,
    createdAt: new Date(2024, 5, 15),
    updatedAt: new Date(2024, 5, 15),
  };

  const mockService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GuestsController],
      providers: [{ provide: GuestsService, useValue: mockService }],
    }).compile();

    controller = module.get<GuestsController>(GuestsController);
    service = module.get<GuestsService>(GuestsService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all guests', async () => {
      const spy = jest
        .spyOn(service, 'findAll')
        .mockResolvedValueOnce([mockGuest]);
      const result = await controller.findAll({});
      expect(result).toEqual([mockGuest]);
      expect(spy).toHaveBeenCalledWith({});
    });

    it('should pass search query', async () => {
      const spy = jest
        .spyOn(service, 'findAll')
        .mockResolvedValueOnce([mockGuest]);
      const result = await controller.findAll({ search: 'john' });
      expect(result).toEqual([mockGuest]);
      expect(spy).toHaveBeenCalledWith({ search: 'john' });
    });
  });

  describe('findOne', () => {
    it('should return a single guest', async () => {
      const spy = jest
        .spyOn(service, 'findOne')
        .mockResolvedValueOnce(mockGuest);
      const result = await controller.findOne(1);
      expect(result).toEqual(mockGuest);
      expect(spy).toHaveBeenCalledWith(1);
    });
  });

  describe('create', () => {
    it('should create a guest', async () => {
      const createDto = {
        name: 'John Smith',
        email: 'john@example.com',
        vip: false,
      };
      const spy = jest
        .spyOn(service, 'create')
        .mockResolvedValueOnce(mockGuest);
      const result = await controller.create(createDto);
      expect(result).toEqual(mockGuest);
      expect(spy).toHaveBeenCalledWith(createDto);
    });
  });

  describe('update', () => {
    it('should update a guest', async () => {
      const updateDto = { name: 'John Updated' };
      const updated = { ...mockGuest, name: 'John Updated' };
      const spy = jest.spyOn(service, 'update').mockResolvedValueOnce(updated);
      const result = await controller.update({ id: 1, data: updateDto });
      expect(result).toEqual(updated);
      expect(spy).toHaveBeenCalledWith(1, updateDto);
    });
  });

  describe('remove', () => {
    it('should remove a guest', async () => {
      const spy = jest
        .spyOn(service, 'remove')
        .mockResolvedValueOnce(mockGuest);
      const result = await controller.remove(1);
      expect(result).toEqual(mockGuest);
      expect(spy).toHaveBeenCalledWith(1);
    });
  });
});
