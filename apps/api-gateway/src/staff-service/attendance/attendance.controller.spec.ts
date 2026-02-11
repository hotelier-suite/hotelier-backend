import { Test, TestingModule } from '@nestjs/testing';
import { of, lastValueFrom } from 'rxjs';
import { AttendanceController } from './';
import { AttendanceService } from './attendance.service';

describe('AttendanceController (gateway)', () => {
  let controller: AttendanceController;
  const mockService: Record<string, jest.Mock> = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    checkIn: jest.fn(),
    checkOut: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AttendanceController],
      providers: [{ provide: AttendanceService, useValue: mockService }],
    }).compile();
    controller = module.get<AttendanceController>(AttendanceController);
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

  it('should remove', async () => {
    mockService.remove.mockReturnValueOnce(of({ id: 1 }));
    const result = await lastValueFrom(controller.remove(1));
    expect(result).toHaveProperty('id');
  });

  it('should checkIn', async () => {
    mockService.checkIn.mockReturnValueOnce(of({ id: 1 }));
    const result = await lastValueFrom(
      controller.checkIn(1, { time: '09:00' } as never),
    );
    expect(result).toHaveProperty('id');
  });

  it('should checkOut', async () => {
    mockService.checkOut.mockReturnValueOnce(of({ id: 1 }));
    const result = await lastValueFrom(
      controller.checkOut(1, { time: '17:00' } as never),
    );
    expect(result).toHaveProperty('id');
  });
});
