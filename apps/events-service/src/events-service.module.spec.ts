import { EventsServiceModule } from './events-service.module';

describe('EventsServiceModule', () => {
  it('should be defined', () => {
    expect(EventsServiceModule).toBeDefined();
  });

  it('should be a module', () => {
    expect(typeof EventsServiceModule).toBe('function');
  });
});
