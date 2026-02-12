import { RecreationalServiceModule } from './recreational-service.module';

describe('RecreationalServiceModule', () => {
  it('should be defined', () => {
    expect(RecreationalServiceModule).toBeDefined();
  });

  it('should be a module', () => {
    expect(typeof RecreationalServiceModule).toBe('function');
  });
});
