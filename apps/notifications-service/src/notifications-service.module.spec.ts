import { NotificationsServiceModule } from './notifications-service.module';

describe('NotificationsServiceModule', () => {
  it('should be defined', () => {
    expect(NotificationsServiceModule).toBeDefined();
  });

  it('should be a module', () => {
    expect(typeof NotificationsServiceModule).toBe('function');
  });
});
