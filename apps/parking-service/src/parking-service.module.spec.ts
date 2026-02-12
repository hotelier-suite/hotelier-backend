import { ParkingServiceModule } from './parking-service.module';

describe('ParkingServiceModule', () => {
  it('should be defined', () => {
    expect(ParkingServiceModule).toBeDefined();
  });

  it('should be a module', () => {
    expect(typeof ParkingServiceModule).toBe('function');
  });
});
