import { AuthServiceModule } from './auth-service.module';

describe('AuthServiceModule', () => {
  it('should be defined', () => {
    expect(AuthServiceModule).toBeDefined();
  });

  it('should be a module', () => {
    expect(typeof AuthServiceModule).toBe('function');
  });
});
