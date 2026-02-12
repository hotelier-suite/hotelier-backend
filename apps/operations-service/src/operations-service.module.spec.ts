import { OperationsServiceModule } from './operations-service.module';

describe('OperationsServiceModule', () => {
  it('should be defined', () => {
    expect(OperationsServiceModule).toBeDefined();
  });

  it('should be a module', () => {
    expect(typeof OperationsServiceModule).toBe('function');
  });
});
