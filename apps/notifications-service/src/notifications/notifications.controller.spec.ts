import { Test } from '@nestjs/testing';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { NotificationType } from '@app/contracts/notifications-service';

describe('NotificationsController', () => {
  let controller: NotificationsController;
  let service: NotificationsService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [NotificationsController],
      providers: [
        {
          provide: NotificationsService,
          useValue: {
            create: jest.fn(),
            findForUser: jest.fn(),
            markRead: jest.fn(),
            markAllRead: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get(NotificationsController);
    service = module.get(NotificationsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // ─── findForUser ──────────────────────────────────────────────────

  describe('findForUser', () => {
    it('should call service.findForUser with userId and includeRead', async () => {
      const notifications = [
        {
          id: 1,
          type: NotificationType.INFO,
          title: 'Test',
          message: 'Message',
          isRead: false,
          userId: 1,
          createdAt: new Date(),
        },
      ];
      const spy = jest
        .spyOn(service, 'findForUser')
        .mockResolvedValue(notifications);

      const result = await controller.findForUser({
        userId: 1,
        includeRead: true,
      });

      expect(spy).toHaveBeenCalledWith(1, true);
      expect(result).toEqual(notifications);
    });

    it('should default includeRead to false when not provided', async () => {
      const spy = jest.spyOn(service, 'findForUser').mockResolvedValue([]);

      await controller.findForUser({ userId: 2 });

      expect(spy).toHaveBeenCalledWith(2, false);
    });

    it('should handle null payload userId', async () => {
      const spy = jest.spyOn(service, 'findForUser').mockResolvedValue([]);

      await controller.findForUser({ userId: null });

      expect(spy).toHaveBeenCalledWith(null, false);
    });

    it('should handle empty payload', async () => {
      const spy = jest.spyOn(service, 'findForUser').mockResolvedValue([]);

      await controller.findForUser({});

      expect(spy).toHaveBeenCalledWith(undefined, false);
    });
  });

  // ─── create ───────────────────────────────────────────────────────

  describe('create', () => {
    it('should create a notification', async () => {
      const dto = {
        title: 'Alert',
        message: 'Something happened',
        type: NotificationType.ALERT,
      };
      const created = {
        id: 1,
        ...dto,
        isRead: false,
        createdAt: new Date(),
      };
      const spy = jest.spyOn(service, 'create').mockResolvedValue(created);

      const result = await controller.create(dto);

      expect(spy).toHaveBeenCalledWith(dto);
      expect(result).toEqual(created);
    });

    it('should create a notification with optional fields', async () => {
      const dto = {
        title: 'Low stock',
        message: 'Water is low',
        type: NotificationType.WARNING,
        refId: 10,
        refType: 'inventory',
        userId: 3,
      };
      const created = {
        id: 2,
        ...dto,
        isRead: false,
        createdAt: new Date(),
      };
      const spy = jest.spyOn(service, 'create').mockResolvedValue(created);

      const result = await controller.create(dto);

      expect(spy).toHaveBeenCalledWith(dto);
      expect(result.refId).toBe(10);
    });
  });

  // ─── markRead ─────────────────────────────────────────────────────

  describe('markRead', () => {
    it('should mark a notification as read', async () => {
      const spy = jest.spyOn(service, 'markRead').mockResolvedValue(undefined);

      await controller.markRead({ id: 5, userId: 1 });

      expect(spy).toHaveBeenCalledWith(5, 1);
    });

    it('should mark a notification as read without userId', async () => {
      const spy = jest.spyOn(service, 'markRead').mockResolvedValue(undefined);

      await controller.markRead({ id: 3 });

      expect(spy).toHaveBeenCalledWith(3, undefined);
    });
  });

  // ─── markAllRead ──────────────────────────────────────────────────

  describe('markAllRead', () => {
    it('should mark all notifications as read for a user', async () => {
      const spy = jest
        .spyOn(service, 'markAllRead')
        .mockResolvedValue(undefined);

      await controller.markAllRead({ userId: 1 });

      expect(spy).toHaveBeenCalledWith(1);
    });

    it('should mark all broadcast notifications as read', async () => {
      const spy = jest
        .spyOn(service, 'markAllRead')
        .mockResolvedValue(undefined);

      await controller.markAllRead({});

      expect(spy).toHaveBeenCalledWith(undefined);
    });
  });
});
