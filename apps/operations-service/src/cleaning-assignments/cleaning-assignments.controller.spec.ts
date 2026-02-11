import { Test, TestingModule } from '@nestjs/testing';
import { CleaningAssignmentsController, CleaningAssignmentsService } from './';
import { CleaningStatus } from '@app/contracts/operations-service';

describe('CleaningAssignmentsController', () => {
  let controller: CleaningAssignmentsController;
  let service: CleaningAssignmentsService;

  const mockAssignment = {
    id: 1,
    assignedDate: new Date(2024, 5, 15),
    status: CleaningStatus.PENDING,
    notes: 'Morning shift cleaning',
    employeeId: 1,
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
      controllers: [CleaningAssignmentsController],
      providers: [
        { provide: CleaningAssignmentsService, useValue: mockService },
      ],
    }).compile();

    controller = module.get<CleaningAssignmentsController>(
      CleaningAssignmentsController,
    );
    service = module.get<CleaningAssignmentsService>(
      CleaningAssignmentsService,
    );
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all cleaning assignments', async () => {
      const spy = jest
        .spyOn(service, 'findAll')
        .mockResolvedValueOnce([mockAssignment]);
      const result = await controller.findAll();
      expect(result).toEqual([mockAssignment]);
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single cleaning assignment', async () => {
      const spy = jest
        .spyOn(service, 'findOne')
        .mockResolvedValueOnce(mockAssignment);
      const result = await controller.findOne(1);
      expect(result).toEqual(mockAssignment);
      expect(spy).toHaveBeenCalledWith(1);
    });
  });

  describe('create', () => {
    it('should create a cleaning assignment', async () => {
      const createDto = { roomId: 1, employeeId: 1, notes: 'Test' };
      const spy = jest
        .spyOn(service, 'create')
        .mockResolvedValueOnce(mockAssignment);
      const result = await controller.create(createDto);
      expect(result).toEqual(mockAssignment);
      expect(spy).toHaveBeenCalledWith(createDto);
    });
  });

  describe('update', () => {
    it('should update a cleaning assignment', async () => {
      const updateDto = { notes: 'Updated' };
      const updated = { ...mockAssignment, notes: 'Updated' };
      const spy = jest.spyOn(service, 'update').mockResolvedValueOnce(updated);
      const result = await controller.update({ id: 1, data: updateDto });
      expect(result).toEqual(updated);
      expect(spy).toHaveBeenCalledWith(1, updateDto);
    });
  });

  describe('remove', () => {
    it('should remove a cleaning assignment', async () => {
      const spy = jest
        .spyOn(service, 'remove')
        .mockResolvedValueOnce(mockAssignment);
      const result = await controller.remove(1);
      expect(result).toEqual(mockAssignment);
      expect(spy).toHaveBeenCalledWith(1);
    });
  });
});
