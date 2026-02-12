import * as request from 'supertest';
import { App } from 'supertest/types';
import * as crypto from 'crypto';
import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { of } from 'rxjs';
import { AuthServiceModule } from '../src/auth-service/auth-service.module';
import { AUTH_SERVICE_CLIENT } from '../src/auth-service/constants';

describe('Auth Service (e2e)', () => {
  let app: INestApplication<App>;
  const mockClient = {
    send: jest.fn().mockReturnValue(of({})),
    emit: jest.fn().mockReturnValue(of({})),
    connect: jest.fn(),
    close: jest.fn(),
  };
  const signTestJwt = (
    payload: { sub: number; email: string } = {
      sub: 1,
      email: 'test@example.com',
    },
  ): string => {
    const header = Buffer.from(
      JSON.stringify({ alg: 'HS256', typ: 'JWT' }),
    ).toString('base64url');
    const body = Buffer.from(
      JSON.stringify({
        ...payload,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 3600,
      }),
    ).toString('base64url');
    const secret = 'super-secret-jwt-key-change-in-production';
    const sig = crypto
      .createHmac('sha256', secret)
      .update(`${header}.${body}`)
      .digest('base64url');
    return `${header}.${body}.${sig}`;
  };
  const jwtToken = signTestJwt();

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [ConfigModule.forRoot(), AuthServiceModule],
    })
      .overrideProvider(AUTH_SERVICE_CLIENT)
      .useValue(mockClient)
      .compile();

    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ─── Auth ─────────────────────────────────────────────────────────────

  describe('POST /api/auth/register', () => {
    it('should register a new user', () => {
      const mockResponse = {
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
        user: { id: 1, email: 'user@example.com' },
      };
      mockClient.send.mockReturnValue(of(mockResponse));

      return request(app.getHttpServer())
        .post('/api/auth/register')
        .send({
          email: 'user@example.com',
          password: 'Password123!',
          name: 'John Doe',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toEqual(mockResponse);
          expect(mockClient.send).toHaveBeenCalled();
        });
    });

    it('should return 400 for empty body', () => {
      return request(app.getHttpServer())
        .post('/api/auth/register')
        .send({})
        .expect(400);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login successfully', () => {
      const mockResponse = {
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
        user: { id: 1, email: 'user@example.com' },
      };
      mockClient.send.mockReturnValue(of(mockResponse));

      return request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ email: 'user@example.com', password: 'Password123!' })
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual(mockResponse);
        });
    });
  });

  describe('POST /api/auth/logout', () => {
    it('should logout with valid token', () => {
      const mockResponse = { message: 'Logged out successfully' };
      mockClient.send.mockReturnValue(of(mockResponse));

      return request(app.getHttpServer())
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual(mockResponse);
        });
    });

    it('should return 401 without token', () => {
      return request(app.getHttpServer()).post('/api/auth/logout').expect(401);
    });
  });

  describe('GET /api/auth/me', () => {
    it('should return user profile with valid token', () => {
      const mockProfile = {
        id: 1,
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
      };
      mockClient.send.mockReturnValue(of(mockProfile));

      return request(app.getHttpServer())
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual(mockProfile);
        });
    });

    it('should return 401 without token', () => {
      return request(app.getHttpServer()).get('/api/auth/me').expect(401);
    });
  });

  // ─── Users ────────────────────────────────────────────────────────────

  describe('GET /api/users', () => {
    it('should return all users with valid token', () => {
      const mockUsers = [
        { id: 1, email: 'user1@example.com' },
        { id: 2, email: 'user2@example.com' },
      ];
      mockClient.send.mockReturnValue(of(mockUsers));

      return request(app.getHttpServer())
        .get('/api/users')
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual(mockUsers);
        });
    });

    it('should return 401 without token', () => {
      return request(app.getHttpServer()).get('/api/users').expect(401);
    });
  });

  describe('GET /api/users/:id', () => {
    it('should return a user by id', () => {
      const mockUser = { id: 1, email: 'user@example.com' };
      mockClient.send.mockReturnValue(of(mockUser));

      return request(app.getHttpServer())
        .get('/api/users/1')
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual(mockUser);
        });
    });
  });

  describe('POST /api/users', () => {
    it('should create a new user', () => {
      const mockUser = { id: 3, email: 'new@example.com' };
      mockClient.send.mockReturnValue(of(mockUser));

      return request(app.getHttpServer())
        .post('/api/users')
        .set('Authorization', `Bearer ${jwtToken}`)
        .send({
          email: 'new@example.com',
          password: 'Password123!',
          name: 'New User',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toEqual(mockUser);
        });
    });
  });

  describe('PATCH /api/users/:id', () => {
    it('should update a user', () => {
      const mockUser = { id: 1, firstName: 'Updated' };
      mockClient.send.mockReturnValue(of(mockUser));

      return request(app.getHttpServer())
        .patch('/api/users/1')
        .set('Authorization', `Bearer ${jwtToken}`)
        .send({ firstName: 'Updated' })
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual(mockUser);
        });
    });
  });

  describe('DELETE /api/users/:id', () => {
    it('should delete a user', () => {
      mockClient.send.mockReturnValue(of({ id: 1 }));

      return request(app.getHttpServer())
        .delete('/api/users/1')
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(200);
    });
  });

  // ─── Roles ────────────────────────────────────────────────────────────

  describe('POST /api/roles', () => {
    it('should create a role', () => {
      const mockRole = { id: 1, name: 'admin' };
      mockClient.send.mockReturnValue(of(mockRole));

      return request(app.getHttpServer())
        .post('/api/roles')
        .send({ name: 'admin', description: 'Administrator' })
        .expect(201)
        .expect((res) => {
          expect(res.body).toEqual(mockRole);
        });
    });
  });

  describe('GET /api/roles', () => {
    it('should return all roles', () => {
      const mockRoles = [{ id: 1, name: 'admin' }];
      mockClient.send.mockReturnValue(of(mockRoles));

      return request(app.getHttpServer())
        .get('/api/roles')
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual(mockRoles);
        });
    });
  });

  describe('GET /api/roles/:id', () => {
    it('should return a role by id', () => {
      const mockRole = { id: 1, name: 'admin' };
      mockClient.send.mockReturnValue(of(mockRole));

      return request(app.getHttpServer())
        .get('/api/roles/1')
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual(mockRole);
        });
    });
  });

  describe('PATCH /api/roles/:id', () => {
    it('should update a role', () => {
      mockClient.send.mockReturnValue(of({ id: 1, name: 'superadmin' }));

      return request(app.getHttpServer())
        .patch('/api/roles/1')
        .send({ name: 'superadmin' })
        .expect(200);
    });
  });

  describe('DELETE /api/roles/:id', () => {
    it('should delete a role', () => {
      mockClient.send.mockReturnValue(of({ id: 1 }));

      return request(app.getHttpServer()).delete('/api/roles/1').expect(200);
    });
  });

  // ─── Permissions ──────────────────────────────────────────────────────

  describe('GET /api/roles/permissions', () => {
    it('should return all permissions', () => {
      const mockPerms = [{ id: 1, name: 'read:rooms' }];
      mockClient.send.mockReturnValue(of(mockPerms));

      return request(app.getHttpServer())
        .get('/api/roles/permissions')
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual(mockPerms);
        });
    });
  });

  describe('POST /api/roles/permissions', () => {
    it('should create a permission', () => {
      const mockPerm = { id: 2, name: 'write:rooms' };
      mockClient.send.mockReturnValue(of(mockPerm));

      return request(app.getHttpServer())
        .post('/api/roles/permissions')
        .send({
          resource: 'rooms',
          action: 'write',
          description: 'Write rooms',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toEqual(mockPerm);
        });
    });
  });

  describe('PATCH /api/roles/permissions/:id', () => {
    it('should update a permission', () => {
      mockClient.send.mockReturnValue(of({ id: 1, name: 'read:all' }));

      return request(app.getHttpServer())
        .patch('/api/roles/permissions/1')
        .send({ name: 'read:all' })
        .expect(200);
    });
  });

  describe('DELETE /api/roles/permissions/:id', () => {
    it('should delete a permission', () => {
      mockClient.send.mockReturnValue(of({ id: 1 }));

      return request(app.getHttpServer())
        .delete('/api/roles/permissions/1')
        .expect(200);
    });
  });
});
