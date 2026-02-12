import { BookingServiceModule } from './booking-service.module';

describe('BookingServiceModule', () => {
  it('should be defined', () => {
    expect(BookingServiceModule).toBeDefined();
  });

  it('should be a module', () => {
    expect(typeof BookingServiceModule).toBe('function');
  });
});
