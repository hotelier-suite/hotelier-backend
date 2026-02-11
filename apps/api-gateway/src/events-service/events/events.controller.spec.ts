import { Test, TestingModule } from '@nestjs/testing';
import { of, lastValueFrom } from 'rxjs';
import { EventsController } from './';
import { EventsService } from './events.service';

describe('EventsController (gateway)', () => {
  let controller: EventsController;
  const mockService: Record<string, jest.Mock> = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventsController],
      providers: [{ provide: EventsService, useValue: mockService }],
    }).compile();
    controller = module.get<EventsController>(EventsController);
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
    expect(result).toHaveProperty('id');
  });

  it('should create', async () => {
    mockService.create.mockReturnValueOnce(of({ id: 1 }));
    const result = await lastValueFrom(
      controller.create({ name: 'test' } as never),
    );
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
