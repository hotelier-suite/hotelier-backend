import { Test, TestingModule } from '@nestjs/testing';
import { of, lastValueFrom } from 'rxjs';
import { CleaningTasksController } from './';
import { CleaningTasksService } from './cleaning-tasks.service';

describe('CleaningTasksController (gateway)', () => {
  let controller: CleaningTasksController;
  const mockService: Record<string, jest.Mock> = {
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
    jest.clearAllMocks();
  });

  it('should findAll', async () => {
    mockService.findAll.mockReturnValueOnce(of([]));
    const result = await lastValueFrom(controller.findAll());
    expect(result).toEqual([]);
  });

  it('should findOne', async () => {
    mockService.findOne.mockReturnValueOnce(of({ id: 1 }));
    const result = await lastValueFrom(controller.findOne(1));
    expect(result).toEqual({ id: 1 });
  });

  it('should create', async () => {
    mockService.create.mockReturnValueOnce(of({ id: 1 }));
    const result = await lastValueFrom(controller.create({} as never));
    expect(result).toEqual({ id: 1 });
  });

  it('should update', async () => {
    mockService.update.mockReturnValueOnce(of({ id: 1 }));
    const result = await lastValueFrom(controller.update(1, {} as never));
    expect(result).toEqual({ id: 1 });
  });

  it('should remove', async () => {
    mockService.remove.mockReturnValueOnce(of({ id: 1 }));
    const result = await lastValueFrom(controller.remove(1));
    expect(result).toEqual({ id: 1 });
  });
});
