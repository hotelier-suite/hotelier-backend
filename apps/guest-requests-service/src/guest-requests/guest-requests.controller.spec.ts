import { Test } from '@nestjs/testing';
import { GuestRequestsController } from './guest-requests.controller';
import { GuestRequestsService } from './guest-requests.service';
import {
  GuestRequestType,
  GuestRequestStatus,
  RequestPriority,
} from '@app/contracts/guest-requests-service';

describe('GuestRequestsController', () => {
  let controller: GuestRequestsController;
  let service: GuestRequestsService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [GuestRequestsController],
      providers: [
        {
          provide: GuestRequestsService,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
            countByStatus: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get(GuestRequestsController);
    service = module.get(GuestRequestsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // ─── findAll ──────────────────────────────────────────────────────

  describe('findAll', () => {
    it('should return all guest requests with no filters', async () => {
      const requests = [
        {
          id: 1,
          room: '301',
          guestName: 'John',
          type: GuestRequestType.TOWELS,
          description: 'Need towels',
          status: GuestRequestStatus.PENDING,
          priority: RequestPriority.MEDIUM,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      const spy = jest.spyOn(service, 'findAll').mockResolvedValue(requests);

      const result = await controller.findAll({});

      expect(spy).toHaveBeenCalledWith({});
      expect(result).toEqual(requests);
    });

    it('should pass status filter to service', async () => {
      const spy = jest.spyOn(service, 'findAll').mockResolvedValue([]);

      await controller.findAll({ status: GuestRequestStatus.PENDING });

      expect(spy).toHaveBeenCalledWith({
        status: GuestRequestStatus.PENDING,
      });
    });

    it('should pass priority and limit filters', async () => {
      const spy = jest.spyOn(service, 'findAll').mockResolvedValue([]);

      await controller.findAll({
        priority: RequestPriority.HIGH,
        limit: 5,
      });

      expect(spy).toHaveBeenCalledWith({
        priority: RequestPriority.HIGH,
        limit: 5,
      });
    });
  });

  // ─── findOne ──────────────────────────────────────────────────────

  describe('findOne', () => {
    it('should return a single guest request', async () => {
      const request = {
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
      const spy = jest.spyOn(service, 'findOne').mockResolvedValue(request);

      const result = await controller.findOne(1);

      expect(spy).toHaveBeenCalledWith(1);
      expect(result).toEqual(request);
    });
  });

  // ─── create ───────────────────────────────────────────────────────

  describe('create', () => {
    it('should create a guest request', async () => {
      const dto = {
        room: '301',
        guestName: 'John',
        type: GuestRequestType.TOWELS,
        description: 'Need towels',
      };
      const created = {
        id: 1,
        ...dto,
        status: GuestRequestStatus.PENDING,
        priority: RequestPriority.MEDIUM,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const spy = jest.spyOn(service, 'create').mockResolvedValue(created);

      const result = await controller.create(dto);

      expect(spy).toHaveBeenCalledWith(dto);
      expect(result).toEqual(created);
    });
  });

  // ─── update ───────────────────────────────────────────────────────

  describe('update', () => {
    it('should update a guest request', async () => {
      const updated = {
        id: 1,
        room: '301',
        guestName: 'John',
        type: GuestRequestType.TOWELS,
        description: 'Need towels',
        status: GuestRequestStatus.COMPLETED,
        priority: RequestPriority.MEDIUM,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const spy = jest.spyOn(service, 'update').mockResolvedValue(updated);

      const result = await controller.update({
        id: 1,
        data: { status: GuestRequestStatus.COMPLETED },
      });

      expect(spy).toHaveBeenCalledWith(1, {
        status: GuestRequestStatus.COMPLETED,
      });
      expect(result).toEqual(updated);
    });
  });

  // ─── remove ───────────────────────────────────────────────────────

  describe('remove', () => {
    it('should remove a guest request', async () => {
      const removed = {
        id: 1,
        room: '301',
        guestName: 'John',
        type: GuestRequestType.TOWELS,
        description: 'Need towels',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const spy = jest.spyOn(service, 'remove').mockResolvedValue(removed);

      const result = await controller.remove(1);

      expect(spy).toHaveBeenCalledWith(1);
      expect(result).toEqual(removed);
    });
  });

  // ─── countByStatus ────────────────────────────────────────────────

  describe('countByStatus', () => {
    it('should return count for a status', async () => {
      const spy = jest.spyOn(service, 'countByStatus').mockResolvedValue(5);

      const result = await controller.countByStatus(GuestRequestStatus.PENDING);

      expect(spy).toHaveBeenCalledWith(GuestRequestStatus.PENDING);
      expect(result).toBe(5);
    });
  });
});
