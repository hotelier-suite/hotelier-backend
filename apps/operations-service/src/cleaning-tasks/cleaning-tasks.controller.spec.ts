import { Test, TestingModule } from '@nestjs/testing';
import { CleaningTasksController, CleaningTasksService } from './';
import { CleaningStatus } from '@app/contracts/operations-service';
import { TaskPriority } from '@app/contracts/common';

describe('CleaningTasksController', () => {
  let controller: CleaningTasksController;
  let service: CleaningTasksService;

  const mockTask = {
    id: 1,
    roomNumber: '101',
    status: CleaningStatus.PENDING,
    assignedEmployee: 'Maria Garcia',
    notes: 'Standard cleaning',
    priority: TaskPriority.NORMAL,
    roomId: 1,
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
      controllers: [CleaningTasksController],
      providers: [{ provide: CleaningTasksService, useValue: mockService }],
    }).compile();

    controller = module.get<CleaningTasksController>(CleaningTasksController);
    service = module.get<CleaningTasksService>(CleaningTasksService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all cleaning tasks', async () => {
      const spy = jest
        .spyOn(service, 'findAll')
        .mockResolvedValueOnce([mockTask]);
      const result = await controller.findAll();
      expect(result).toEqual([mockTask]);
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single cleaning task', async () => {
      const spy = jest
        .spyOn(service, 'findOne')
        .mockResolvedValueOnce(mockTask);
      const result = await controller.findOne(1);
      expect(result).toEqual(mockTask);
      expect(spy).toHaveBeenCalledWith(1);
    });
  });

  describe('create', () => {
    it('should create a cleaning task', async () => {
      const createDto = {
        roomNumber: '101',
        roomId: 1,
        priority: TaskPriority.NORMAL,
      };
      const spy = jest.spyOn(service, 'create').mockResolvedValueOnce(mockTask);
      const result = await controller.create(createDto);
      expect(result).toEqual(mockTask);
      expect(spy).toHaveBeenCalledWith(createDto);
    });
  });

  describe('update', () => {
    it('should update a cleaning task', async () => {
      const updateDto = { notes: 'Updated' };
      const updated = { ...mockTask, notes: 'Updated' };
      const spy = jest.spyOn(service, 'update').mockResolvedValueOnce(updated);
      const result = await controller.update({ id: 1, data: updateDto });
      expect(result).toEqual(updated);
      expect(spy).toHaveBeenCalledWith(1, updateDto);
    });
  });

  describe('remove', () => {
    it('should remove a cleaning task', async () => {
      const spy = jest.spyOn(service, 'remove').mockResolvedValueOnce(mockTask);
      const result = await controller.remove(1);
      expect(result).toEqual(mockTask);
      expect(spy).toHaveBeenCalledWith(1);
    });
  });
});
