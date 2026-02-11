import { Test, TestingModule } from '@nestjs/testing';
import { RoomsController, RoomsService } from './';

describe('RoomsController', () => {
  let controller: RoomsController;
  const mockService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    setAvailability: jest.fn(),
  };

  const mockRoom = {
    id: 1,
    number: '101',
    type: 'INDIVIDUAL',
    price: 50.0,
    capacity: 1,
    isAvailable: true,
    description: 'Single room',
    createdAt: new Date(2024, 5, 15),
    updatedAt: new Date(2024, 5, 15),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoomsController],
      providers: [{ provide: RoomsService, useValue: mockService }],
    }).compile();

    controller = module.get<RoomsController>(RoomsController);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all rooms', async () => {
      mockService.findAll.mockResolvedValueOnce([mockRoom]);
      const result = await controller.findAll({});
      expect(result).toEqual([mockRoom]);
    });
  });

  describe('findOne', () => {
    it('should return a room by id', async () => {
      mockService.findOne.mockResolvedValueOnce(mockRoom);
      const result = await controller.findOne(1);
      expect(result).toEqual(mockRoom);
    });
  });

  describe('create', () => {
    it('should create a room', async () => {
      mockService.create.mockResolvedValueOnce(mockRoom);
      const result = await controller.create({
        number: '101',
        type: 'INDIVIDUAL' as never,
        price: 50,
        capacity: 1,
      });
      expect(result).toEqual(mockRoom);
    });
  });

  describe('update', () => {
    it('should update a room', async () => {
      mockService.update.mockResolvedValueOnce(mockRoom);
      const result = await controller.update({
        id: 1,
        data: { price: 60 },
      });
      expect(result).toEqual(mockRoom);
    });
  });

  describe('remove', () => {
    it('should remove a room', async () => {
      mockService.remove.mockResolvedValueOnce(mockRoom);
      const result = await controller.remove(1);
      expect(result).toEqual(mockRoom);
    });
  });

  describe('setAvailability', () => {
    it('should set room availability', async () => {
      const updated = { ...mockRoom, isAvailable: false };
      mockService.setAvailability.mockResolvedValueOnce(updated);
      const result = await controller.setAvailability({
        id: 1,
        isAvailable: false,
      });
      expect(result).toEqual(updated);
    });
  });
});
