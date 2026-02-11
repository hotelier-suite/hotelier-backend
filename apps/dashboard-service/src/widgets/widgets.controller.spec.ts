import { Test, TestingModule } from '@nestjs/testing';
import { WidgetsController, WidgetsService } from './';
import {
  DashboardWidgetDto,
  CreateDashboardWidgetDto,
  UpdateDashboardWidgetDto,
  FindWidgetsFilterDto,
} from '@app/contracts/dashboard-service';

describe('WidgetsController', () => {
  let controller: WidgetsController;
  let service: WidgetsService;

  const mockWidget: DashboardWidgetDto = {
    id: 1,
    title: 'Revenue Chart',
    type: 'chart',
    configuration: { chartType: 'line' },
    position: 0,
    visible: true,
    userId: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockService = {
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
    service = module.get<WidgetsService>(WidgetsService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a widget', async () => {
      const dto: CreateDashboardWidgetDto = {
        title: 'Revenue Chart',
        type: 'chart',
        configuration: { chartType: 'line' },
        userId: 1,
      };
      const spy = jest
        .spyOn(service, 'create')
        .mockResolvedValueOnce(mockWidget);
      const result = await controller.create(dto);
      expect(spy).toHaveBeenCalledWith(dto);
      expect(result).toEqual(mockWidget);
    });
  });

  describe('findAll', () => {
    it('should return all widgets', async () => {
      const filters: FindWidgetsFilterDto = {};
      const spy = jest
        .spyOn(service, 'findAll')
        .mockResolvedValueOnce([mockWidget]);
      const result = await controller.findAll(filters);
      expect(spy).toHaveBeenCalledWith(filters);
      expect(result).toEqual([mockWidget]);
    });
  });

  describe('findOne', () => {
    it('should return a widget by id', async () => {
      const spy = jest
        .spyOn(service, 'findOne')
        .mockResolvedValueOnce(mockWidget);
      const result = await controller.findOne(1);
      expect(spy).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockWidget);
    });
  });

  describe('update', () => {
    it('should update a widget', async () => {
      const data: UpdateDashboardWidgetDto = { title: 'Updated' };
      const updated = { ...mockWidget, title: 'Updated' };
      const spy = jest.spyOn(service, 'update').mockResolvedValueOnce(updated);
      const result = await controller.update({ id: 1, data });
      expect(spy).toHaveBeenCalledWith(1, data);
      expect(result.title).toBe('Updated');
    });
  });

  describe('remove', () => {
    it('should remove a widget', async () => {
      const spy = jest
        .spyOn(service, 'remove')
        .mockResolvedValueOnce(mockWidget);
      const result = await controller.remove(1);
      expect(spy).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockWidget);
    });
  });
});
