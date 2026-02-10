import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RpcException } from '@nestjs/microservices';
import { GuestRequestsService } from './guest-requests.service';
import { GuestRequest } from './entities';
import {
  GuestRequestType,
  GuestRequestStatus,
  RequestPriority,
} from '@app/contracts/guest-requests-service';

describe('GuestRequestsService', () => {
  let service: GuestRequestsService;
  let repo: Record<string, jest.Mock>;

  const mockRequest = {
    id: 1,
    room: '301',
    guestName: 'John',
    type: GuestRequestType.TOWELS,
    description: 'Need towels',
    status: GuestRequestStatus.PENDING,
    priority: RequestPriority.MEDIUM,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    repo = {
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      merge: jest.fn(),
      remove: jest.fn(),
      count: jest.fn(),
    };

    const module = await Test.createTestingModule({
      providers: [
        GuestRequestsService,
        {
          provide: getRepositoryToken(GuestRequest),
          useValue: repo,
        },
      ],
    }).compile();

    service = module.get(GuestRequestsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // ─── findAll ──────────────────────────────────────────────────────

  describe('findAll', () => {
    it('should return all requests with no filters', async () => {
      repo.find.mockResolvedValue([mockRequest]);

      const result = await service.findAll({});

      expect(repo.find).toHaveBeenCalledWith({
        where: {},
        order: { createdAt: 'DESC' },
        take: undefined,
      });
      expect(result).toEqual([mockRequest]);
    });

    it('should filter by status', async () => {
      repo.find.mockResolvedValue([]);

      await service.findAll({ status: GuestRequestStatus.PENDING });

      expect(repo.find).toHaveBeenCalledWith({
        where: { status: GuestRequestStatus.PENDING },
        order: { createdAt: 'DESC' },
        take: undefined,
      });
    });

    it('should filter by priority', async () => {
      repo.find.mockResolvedValue([]);

      await service.findAll({ priority: RequestPriority.HIGH });

      expect(repo.find).toHaveBeenCalledWith({
        where: { priority: RequestPriority.HIGH },
        order: { createdAt: 'DESC' },
        take: undefined,
      });
    });

    it('should apply limit', async () => {
      repo.find.mockResolvedValue([]);

      await service.findAll({ limit: 5 });

      expect(repo.find).toHaveBeenCalledWith({
        where: {},
        order: { createdAt: 'DESC' },
        take: 5,
      });
    });

    it('should apply all filters together', async () => {
      repo.find.mockResolvedValue([]);

      await service.findAll({
        status: GuestRequestStatus.IN_PROGRESS,
        priority: RequestPriority.URGENT,
        limit: 10,
      });

      expect(repo.find).toHaveBeenCalledWith({
        where: {
          status: GuestRequestStatus.IN_PROGRESS,
          priority: RequestPriority.URGENT,
        },
        order: { createdAt: 'DESC' },
        take: 10,
      });
    });
  });

  // ─── findOne ──────────────────────────────────────────────────────

  describe('findOne', () => {
    it('should return a request by id', async () => {
      repo.findOne.mockResolvedValue(mockRequest);

      const result = await service.findOne(1);

      expect(repo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(mockRequest);
    });

    it('should throw RpcException when not found', async () => {
      repo.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(RpcException);
    });
  });

  // ─── create ───────────────────────────────────────────────────────

  describe('create', () => {
    it('should create and save a guest request', async () => {
      const dto = {
        room: '301',
        guestName: 'John',
        type: GuestRequestType.TOWELS,
        description: 'Need towels',
      };
      repo.create.mockReturnValue(mockRequest);
      repo.save.mockResolvedValue(mockRequest);

      const result = await service.create(dto);

      expect(repo.create).toHaveBeenCalledWith(dto);
      expect(repo.save).toHaveBeenCalledWith(mockRequest);
      expect(result).toEqual(mockRequest);
    });
  });

  // ─── update ───────────────────────────────────────────────────────

  describe('update', () => {
    it('should update an existing guest request', async () => {
      const updateData = { status: GuestRequestStatus.COMPLETED };
      const merged = { ...mockRequest, ...updateData };

      repo.findOne.mockResolvedValue(mockRequest);
      repo.create.mockReturnValue(mockRequest);
      repo.merge.mockReturnValue(merged);
      repo.save.mockResolvedValue(merged);

      const result = await service.update(1, updateData);

      expect(repo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(repo.merge).toHaveBeenCalledWith(mockRequest, updateData);
      expect(repo.save).toHaveBeenCalledWith(merged);
      expect(result).toEqual(merged);
    });

    it('should throw RpcException when updating non-existent request', async () => {
      repo.findOne.mockResolvedValue(null);

      await expect(
        service.update(999, { status: GuestRequestStatus.COMPLETED }),
      ).rejects.toThrow(RpcException);
    });
  });

  // ─── remove ───────────────────────────────────────────────────────

  describe('remove', () => {
    it('should remove an existing guest request', async () => {
      repo.findOne.mockResolvedValue(mockRequest);
      repo.create.mockReturnValue(mockRequest);
      repo.remove.mockResolvedValue(mockRequest);

      const result = await service.remove(1);

      expect(repo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(repo.remove).toHaveBeenCalledWith(mockRequest);
      expect(result).toEqual(mockRequest);
    });

    it('should throw RpcException when removing non-existent request', async () => {
      repo.findOne.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(RpcException);
    });
  });

  // ─── countByStatus ────────────────────────────────────────────────

  describe('countByStatus', () => {
    it('should return count for a given status', async () => {
      repo.count.mockResolvedValue(3);

      const result = await service.countByStatus(GuestRequestStatus.PENDING);

      expect(repo.count).toHaveBeenCalledWith({
        where: { status: GuestRequestStatus.PENDING },
      });
      expect(result).toBe(3);
    });

    it('should return 0 when no requests match', async () => {
      repo.count.mockResolvedValue(0);

      const result = await service.countByStatus(GuestRequestStatus.CANCELLED);

      expect(result).toBe(0);
    });
  });
});
