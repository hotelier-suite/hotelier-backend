import { Test, TestingModule } from '@nestjs/testing';
import { of, lastValueFrom } from 'rxjs';
import { EmployeeRequestsController } from './';
import { EmployeeRequestsService } from './employee-requests.service';

describe('EmployeeRequestsController (gateway)', () => {
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

  it('should findAll', async () => {
    mockService.findAll.mockReturnValueOnce(of([]));
    const result = await lastValueFrom(controller.findAll({} as never));
    expect(result).toEqual([]);
  });

  it('should findOne', async () => {
    mockService.findOne.mockReturnValueOnce(of({ id: 1 }));
    const result = await lastValueFrom(controller.findOne(1));
    expect(result).toHaveProperty('id');
  });

  it('should create', async () => {
    mockService.create.mockReturnValueOnce(of({ id: 1 }));
    const result = await lastValueFrom(controller.create({} as never));
    expect(result).toHaveProperty('id');
  });

  it('should update', async () => {
    mockService.update.mockReturnValueOnce(of({ id: 1 }));
    const result = await lastValueFrom(controller.update(1, {} as never));
    expect(result).toHaveProperty('id');
  });

  it('should approve', async () => {
    mockService.approve.mockReturnValueOnce(of({ id: 1 }));
    const result = await lastValueFrom(
      controller.approve(1, { approvedBy: 'Manager' } as never),
    );
    expect(result).toHaveProperty('id');
  });

  it('should reject', async () => {
    mockService.reject.mockReturnValueOnce(of({ id: 1 }));
    const result = await lastValueFrom(controller.reject(1));
    expect(result).toHaveProperty('id');
  });

  it('should remove', async () => {
    mockService.remove.mockReturnValueOnce(of({ id: 1 }));
    const result = await lastValueFrom(controller.remove(1));
    expect(result).toHaveProperty('id');
  });
});
