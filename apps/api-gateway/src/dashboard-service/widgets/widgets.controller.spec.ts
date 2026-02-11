import { Test, TestingModule } from '@nestjs/testing';
import { of, lastValueFrom } from 'rxjs';
import { WidgetsController } from './';
import { WidgetsService } from './widgets.service';

describe('WidgetsController (gateway)', () => {
  let controller: WidgetsController;
  const mockService: Record<string, jest.Mock> = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WidgetsController],
      providers: [{ provide: WidgetsService, useValue: mockService }],
    }).compile();
    controller = module.get<WidgetsController>(WidgetsController);
    jest.clearAllMocks();
  });

  it('should create', async () => {
    mockService.create.mockReturnValueOnce(of({ id: 1 }));
    const result = await lastValueFrom(
      controller.create({ name: 'test' } as never),
    );
    expect(result).toHaveProperty('id');
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

  it('should update', async () => {
    mockService.update.mockReturnValueOnce(of({ id: 1 }));
    const result = await lastValueFrom(
      controller.update(1, { name: 'updated' } as never),
    );
    expect(result).toHaveProperty('id');
  });

  it('should remove', async () => {
    mockService.remove.mockReturnValueOnce(of({ id: 1 }));
    const result = await lastValueFrom(controller.remove(1));
    expect(result).toHaveProperty('id');
  });
});
