import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotificationsService } from './notifications.service';
import { Notification } from './entities';
import { NotificationType } from '@app/contracts/notifications-service';

const createMockQueryBuilder = (overrides = {}) => ({
  where: jest.fn().mockReturnThis(),
  andWhere: jest.fn().mockReturnThis(),
  orderBy: jest.fn().mockReturnThis(),
  update: jest.fn().mockReturnThis(),
  set: jest.fn().mockReturnThis(),
  execute: jest.fn().mockResolvedValue({ affected: 1 }),
  getMany: jest.fn().mockResolvedValue([]),
  ...overrides,
});

describe('NotificationsService', () => {
  let service: NotificationsService;
  let repo: Record<string, jest.Mock>;

  beforeEach(async () => {
    repo = {
      create: jest.fn(),
      save: jest.fn(),
      createQueryBuilder: jest.fn(),
    };

    const module = await Test.createTestingModule({
      providers: [
        NotificationsService,
        {
          provide: getRepositoryToken(Notification),
          useValue: repo,
        },
      ],
    }).compile();

    service = module.get(NotificationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // ─── create ───────────────────────────────────────────────────────

  describe('create', () => {
    it('should create and save a notification', async () => {
      const dto = {
        title: 'Test notification',
        message: 'Test message',
        type: NotificationType.INFO,
      };
      const entity = { id: 1, ...dto, isRead: false, createdAt: new Date() };

      repo.create.mockReturnValue(entity);
      repo.save.mockResolvedValue(entity);

      const result = await service.create(dto);

      expect(repo.create).toHaveBeenCalledWith(dto);
      expect(repo.save).toHaveBeenCalledWith(entity);
      expect(result).toEqual(entity);
    });

    it('should create notification with optional fields', async () => {
      const dto = {
        title: 'Low stock alert',
        message: 'Item running low',
        type: NotificationType.WARNING,
        refId: 42,
        refType: 'inventory',
        userId: 5,
      };
      const entity = { id: 2, ...dto, isRead: false, createdAt: new Date() };

      repo.create.mockReturnValue(entity);
      repo.save.mockResolvedValue(entity);

      const result = await service.create(dto);

      expect(repo.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(entity);
    });
  });

  // ─── findForUser ──────────────────────────────────────────────────

  describe('findForUser', () => {
    it('should return unread notifications for a user', async () => {
      const notifications = [
        {
          id: 1,
          title: 'N1',
          message: 'M1',
          type: NotificationType.INFO,
          isRead: false,
          userId: 1,
          createdAt: new Date(),
        },
      ];
      const qb = createMockQueryBuilder({
        getMany: jest.fn().mockResolvedValue(notifications),
      });
      repo.createQueryBuilder.mockReturnValue(qb);

      const result = await service.findForUser(1, false);

      expect(repo.createQueryBuilder).toHaveBeenCalledWith('n');
      expect(qb.where).toHaveBeenCalledWith(
        '(n.userId IS NULL OR n.userId = :uid)',
        { uid: 1 },
      );
      expect(qb.orderBy).toHaveBeenCalledWith('n.createdAt', 'DESC');
      expect(qb.andWhere).toHaveBeenCalledWith('n.isRead = false');
      expect(result).toEqual(notifications);
    });

    it('should include read notifications when includeRead is true', async () => {
      const qb = createMockQueryBuilder({
        getMany: jest.fn().mockResolvedValue([]),
      });
      repo.createQueryBuilder.mockReturnValue(qb);

      await service.findForUser(1, true);

      expect(qb.andWhere).not.toHaveBeenCalled();
    });

    it('should handle null userId', async () => {
      const qb = createMockQueryBuilder({
        getMany: jest.fn().mockResolvedValue([]),
      });
      repo.createQueryBuilder.mockReturnValue(qb);

      await service.findForUser(null, false);

      expect(qb.where).toHaveBeenCalledWith(
        '(n.userId IS NULL OR n.userId = :uid)',
        { uid: null },
      );
    });

    it('should handle undefined userId', async () => {
      const qb = createMockQueryBuilder({
        getMany: jest.fn().mockResolvedValue([]),
      });
      repo.createQueryBuilder.mockReturnValue(qb);

      await service.findForUser(undefined, false);

      expect(qb.where).toHaveBeenCalledWith(
        '(n.userId IS NULL OR n.userId = :uid)',
        { uid: null },
      );
    });

    it('should default includeRead to false', async () => {
      const qb = createMockQueryBuilder({
        getMany: jest.fn().mockResolvedValue([]),
      });
      repo.createQueryBuilder.mockReturnValue(qb);

      await service.findForUser(1);

      expect(qb.andWhere).toHaveBeenCalledWith('n.isRead = false');
    });
  });

  // ─── markRead ─────────────────────────────────────────────────────

  describe('markRead', () => {
    it('should mark a specific notification as read for a user', async () => {
      const qb = createMockQueryBuilder();
      repo.createQueryBuilder.mockReturnValue(qb);

      await service.markRead(5, 1);

      expect(qb.update).toHaveBeenCalledWith(Notification);
      expect(qb.set).toHaveBeenCalledWith({ isRead: true });
      expect(qb.where).toHaveBeenCalledWith('id = :id', { id: 5 });
      expect(qb.andWhere).toHaveBeenCalledWith(
        '(userId = :uid OR userId IS NULL)',
        { uid: 1 },
      );
      expect(qb.execute).toHaveBeenCalled();
    });

    it('should mark a broadcast notification as read when userId is undefined', async () => {
      const qb = createMockQueryBuilder();
      repo.createQueryBuilder.mockReturnValue(qb);

      await service.markRead(5, undefined);

      expect(qb.where).toHaveBeenCalledWith('id = :id', { id: 5 });
      expect(qb.andWhere).toHaveBeenCalledWith('userId IS NULL');
      expect(qb.execute).toHaveBeenCalled();
    });

    it('should mark for userId = 0 (falsy but not null)', async () => {
      const qb = createMockQueryBuilder();
      repo.createQueryBuilder.mockReturnValue(qb);

      // userId = 0 → `0 != null` is true → user-specific branch
      await service.markRead(10, 0);

      expect(qb.andWhere).toHaveBeenCalledWith(
        '(userId = :uid OR userId IS NULL)',
        { uid: 0 },
      );
    });
  });

  // ─── markAllRead ──────────────────────────────────────────────────

  describe('markAllRead', () => {
    it('should mark all notifications as read for a user', async () => {
      const qb = createMockQueryBuilder();
      repo.createQueryBuilder.mockReturnValue(qb);

      await service.markAllRead(1);

      expect(qb.update).toHaveBeenCalledWith(Notification);
      expect(qb.set).toHaveBeenCalledWith({ isRead: true });
      expect(qb.where).toHaveBeenCalledWith('userId = :uid OR userId IS NULL', {
        uid: 1,
      });
      expect(qb.execute).toHaveBeenCalled();
    });

    it('should mark all broadcast notifications as read when userId is undefined', async () => {
      const qb = createMockQueryBuilder();
      repo.createQueryBuilder.mockReturnValue(qb);

      await service.markAllRead(undefined);

      expect(qb.where).toHaveBeenCalledWith('userId IS NULL');
      expect(qb.execute).toHaveBeenCalled();
    });

    it('should mark all for userId = 0', async () => {
      const qb = createMockQueryBuilder();
      repo.createQueryBuilder.mockReturnValue(qb);

      await service.markAllRead(0);

      expect(qb.where).toHaveBeenCalledWith('userId = :uid OR userId IS NULL', {
        uid: 0,
      });
    });
  });
});
