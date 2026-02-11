import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RpcException } from '@nestjs/microservices';
import { WidgetsService } from './';
import { DashboardWidget } from './entities';

describe('WidgetsService', () => {
  let service: WidgetsService;

  const mockRepository: Record<string, jest.Mock> = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    merge: jest.fn(),
    remove: jest.fn(),
  };

  const mockWidget = {
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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WidgetsService,
        {
          provide: getRepositoryToken(DashboardWidget),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<WidgetsService>(WidgetsService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a widget', async () => {
      mockRepository.create.mockReturnValueOnce(mockWidget);
      mockRepository.save.mockResolvedValueOnce(mockWidget);
      const result = await service.create({
        title: 'Revenue Chart',
        type: 'chart',
        configuration: { chartType: 'line' },
        userId: 1,
      });
      expect(result).toEqual(mockWidget);
    });
  });

  describe('findAll', () => {
    it('should return widgets with default visible filter', async () => {
      mockRepository.find.mockResolvedValueOnce([mockWidget]);
      const result = await service.findAll({});
      expect(result).toEqual([mockWidget]);
      expect(mockRepository.find).toHaveBeenCalledWith(
        expect.objectContaining({ where: { visible: true } }),
      );
    });

    it('should filter by userId', async () => {
      mockRepository.find.mockResolvedValueOnce([mockWidget]);
      await service.findAll({ userId: 1 });
      expect(mockRepository.find).toHaveBeenCalledWith(
        expect.objectContaining({ where: { visible: true, userId: 1 } }),
      );
    });
  });

  describe('findOne', () => {
    it('should return a widget by id', async () => {
      mockRepository.findOne.mockResolvedValueOnce(mockWidget);
      const result = await service.findOne(1);
      expect(result).toEqual(mockWidget);
    });

    it('should throw RpcException when not found', async () => {
      mockRepository.findOne.mockResolvedValueOnce(null);
      await expect(service.findOne(999)).rejects.toThrow(RpcException);
    });
  });

  describe('update', () => {
    it('should update a widget', async () => {
      const updated = { ...mockWidget, title: 'Updated' };
      mockRepository.findOne.mockResolvedValueOnce(mockWidget);
      mockRepository.create.mockReturnValueOnce(mockWidget);
      mockRepository.merge.mockReturnValueOnce(updated);
      mockRepository.save.mockResolvedValueOnce(updated);
      const result = await service.update(1, { title: 'Updated' });
      expect(result.title).toBe('Updated');
    });
  });

  describe('remove', () => {
    it('should remove a widget', async () => {
      mockRepository.findOne.mockResolvedValueOnce(mockWidget);
      mockRepository.create.mockReturnValueOnce(mockWidget);
      mockRepository.remove.mockResolvedValueOnce(mockWidget);
      const result = await service.remove(1);
      expect(result).toEqual(mockWidget);
    });
  });
});
