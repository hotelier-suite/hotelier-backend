import { Test, TestingModule } from '@nestjs/testing';
import { of, lastValueFrom } from 'rxjs';
import { AuthService } from './';
import { AUTH_SERVICE_CLIENT } from '../constants';

describe('AuthService (gateway)', () => {
  let service: AuthService;
  const mockClient = { send: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: AUTH_SERVICE_CLIENT, useValue: mockClient },
      ],
    }).compile();
    service = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  it('should register', async () => {
    mockClient.send.mockReturnValueOnce(of({ user: { id: 1 } }));
    const result = await lastValueFrom(
      service.register({ email: 'a@b.com', password: '123' } as never),
    );
    expect(result).toHaveProperty('user');
  });

  it('should login', async () => {
    mockClient.send.mockReturnValueOnce(of({ user: { id: 1 } }));
    const result = await lastValueFrom(
      service.login({ email: 'a@b.com', password: '123' } as never),
    );
    expect(result).toHaveProperty('user');
  });

  it('should logout', async () => {
    mockClient.send.mockReturnValueOnce(of({ message: 'ok' }));
    const result = await lastValueFrom(service.logout(1));
    expect(result).toEqual({ message: 'ok' });
  });

  it('should refreshTokens', async () => {
    mockClient.send.mockReturnValueOnce(of({ accessToken: 'new' }));
    const result = await lastValueFrom(service.refreshTokens(1, 'token'));
    expect(result).toHaveProperty('accessToken');
  });

  it('should getProfile', async () => {
    mockClient.send.mockReturnValueOnce(of({ id: 1, email: 'a@b.com' }));
    const result = await lastValueFrom(service.getProfile(1));
    expect(result).toHaveProperty('id');
  });
});
