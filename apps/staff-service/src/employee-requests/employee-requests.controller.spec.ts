import { Test, TestingModule } from '@nestjs/testing';
import { EmployeeRequestsController, EmployeeRequestsService } from './';

describe('EmployeeRequestsController', () => {
  let controller: EmployeeRequestsController;
  const mockService: Record<string, jest.Mock> = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    approve: jest.fn(),
    reject: jest.fn(),
    remove: jest.fn(),
  };

  const mockRequest = {
    id: 1,
    type: 'VACATION',
    reason: 'Family vacation',
    startDate: new Date(2024, 5, 15),
    endDate: new Date(2024, 5, 20),
    days: 5,
    status: 'PENDING',
    employeeId: 1,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmployeeRequestsController],
      providers: [{ provide: EmployeeRequestsService, useValue: mockService }],
    }).compile();

    controller = module.get<EmployeeRequestsController>(
      EmployeeRequestsController,
    );
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should find all requests', async () => {
    mockService.findAll.mockResolvedValueOnce([mockRequest]);
    const result = await controller.findAll({});
    expect(result).toEqual([mockRequest]);
  });

  it('should find one request', async () => {
    mockService.findOne.mockResolvedValueOnce(mockRequest);
    const result = await controller.findOne(1);
    expect(result).toEqual(mockRequest);
  });

  it('should create a request', async () => {
    mockService.create.mockResolvedValueOnce(mockRequest);
    const result = await controller.create({
      type: 'VACATION' as never,
      reason: 'Family vacation',
      startDate: new Date(2024, 5, 15),
      endDate: new Date(2024, 5, 20),
      days: 5,
      employeeId: 1,
    });
    expect(result).toEqual(mockRequest);
  });

  it('should update a request', async () => {
    const updated = { ...mockRequest, approvedBy: 'Manager' };
    mockService.update.mockResolvedValueOnce(updated);
    const result = await controller.update({
      id: 1,
      data: { approvedBy: 'Manager' },
    });
    expect(result).toEqual(updated);
  });

  it('should approve a request', async () => {
    const approved = { ...mockRequest, status: 'APPROVED' };
    mockService.approve.mockResolvedValueOnce(approved);
    const result = await controller.approve({
      id: 1,
      approvedBy: 'Manager',
    });
    expect(result).toEqual(approved);
  });

  it('should reject a request', async () => {
    const rejected = { ...mockRequest, status: 'REJECTED' };
    mockService.reject.mockResolvedValueOnce(rejected);
    const result = await controller.reject(1);
    expect(result).toEqual(rejected);
  });

  it('should remove a request', async () => {
    mockService.remove.mockResolvedValueOnce(mockRequest);
    const result = await controller.remove(1);
    expect(result).toEqual(mockRequest);
  });
});
