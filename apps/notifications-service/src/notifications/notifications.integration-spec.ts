import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { newDb, DataType } from 'pg-mem';
import { NotificationsModule } from './notifications.module';
import { NotificationsService } from './notifications.service';
import { Notification } from './entities/notification.entity';
import { NotificationType } from '@app/contracts/notifications-service';

describe('NotificationsService (integration)', () => {
  let module: TestingModule;
  let service: NotificationsService;

  beforeAll(async () => {
    const db = newDb({ autoCreateForeignKeyIndices: true });
    db.public.registerFunction({
      name: 'current_database',
      returns: DataType.text,
      implementation: () => 'test',
    });
    db.public.registerFunction({
      name: 'version',
      returns: DataType.text,
      implementation: () => 'PostgreSQL 18.0 (pg-mem)',
    });

    module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRootAsync({
          useFactory: (): TypeOrmModuleOptions => ({
            type: 'postgres',
            entities: [Notification],
          }),
          dataSourceFactory: async (options) => {
            const ds = db.adapters.createTypeormDataSource(
              options,
            ) as DataSource;
            await ds.initialize();
            await ds.synchronize();
            return ds;
          },
        }),
        NotificationsModule,
      ],
    }).compile();

    service = module.get(NotificationsService);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should create a notification', async () => {
    const result = await service.create({
      type: NotificationType.INFO,
      title: 'Test Notification',
      message: 'This is a test notification',
    });

    expect(result).toBeDefined();
    expect(result.id).toBeDefined();
    expect(result.title).toBe('Test Notification');
    expect(result.type).toBe(NotificationType.INFO);
    expect(result.isRead).toBe(false);
  });

  it('should find notifications for user (broadcast)', async () => {
    await service.create({
      type: NotificationType.WARNING,
      title: 'Broadcast',
      message: 'Broadcast message',
      userId: null,
    });

    const results = await service.findForUser(null, false);
    expect(results.length).toBeGreaterThanOrEqual(1);
  });

  it('should find notifications for specific user', async () => {
    await service.create({
      type: NotificationType.ALERT,
      title: 'User Alert',
      message: 'Alert for user 42',
      userId: 42,
    });

    const results = await service.findForUser(42, false);
    const found = results.find((n) => n.title === 'User Alert');
    expect(found).toBeDefined();
    expect(found?.userId).toBe(42);
  });

  it('should mark a notification as read', async () => {
    const created = await service.create({
      type: NotificationType.INFO,
      title: 'To Read',
      message: 'Will be marked as read',
    });

    await service.markRead(created.id);

    const all = await service.findForUser(null, true);
    const found = all.find((n) => n.id === created.id);
    expect(found?.isRead).toBe(true);
  });

  it('should mark all notifications as read', async () => {
    await service.create({
      type: NotificationType.INFO,
      title: 'Unread 1',
      message: 'msg',
    });
    await service.create({
      type: NotificationType.INFO,
      title: 'Unread 2',
      message: 'msg',
    });

    await service.markAllRead();

    const unread = await service.findForUser(null, false);
    expect(unread.length).toBe(0);
  });
});
