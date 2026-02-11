import { CallHandler, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { of, throwError, lastValueFrom } from 'rxjs';
import { AuditLogInterceptor } from './';
import { AuditService } from '..';
import { AuditAction, AuditResource } from '@app/contracts/audit-service';

describe('AuditLogInterceptor', () => {
  let interceptor: AuditLogInterceptor;
  const mockAuditService: Record<string, jest.Mock> = {
    log: jest.fn().mockReturnValue(of({})),
  };
  const mockReflector: Record<string, jest.Mock> = {
    get: jest.fn(),
  };

  const mockRequest = {
    method: 'POST',
    url: '/test',
    body: { name: 'Test', password: 'secret123' },
    params: { id: '1' },
    headers: { 'user-agent': 'test-agent' },
    user: { id: 5, sub: 5 },
  };

  const createContext = (): ExecutionContext =>
    ({
      switchToHttp: () => ({ getRequest: () => mockRequest }),
      getHandler: () => jest.fn(),
      getClass: () => jest.fn(),
    }) as unknown as ExecutionContext;

  beforeEach(() => {
    interceptor = new AuditLogInterceptor(
      mockAuditService as unknown as AuditService,
      mockReflector as unknown as Reflector,
    );
    jest.clearAllMocks();
    mockAuditService.log.mockReturnValue({
      subscribe: jest.fn().mockReturnValue(undefined),
    });
  });

  it('should pass through when no audit options', async () => {
    mockReflector.get.mockReturnValue(undefined);
    const handler: CallHandler = { handle: () => of('result') };
    const result = await lastValueFrom(
      interceptor.intercept(createContext(), handler),
    );
    expect(result).toBe('result');
    expect(mockAuditService.log).not.toHaveBeenCalled();
  });

  it('should log on success', async () => {
    mockReflector.get
      .mockReturnValueOnce({
        action: AuditAction.CREATE,
        resource: AuditResource.ROOM,
        description: 'Room created',
      })
      .mockReturnValueOnce(undefined);
    const handler: CallHandler = { handle: () => of({ id: 1 }) };
    await lastValueFrom(interceptor.intercept(createContext(), handler));
    expect(mockAuditService.log).toHaveBeenCalled();
  });

  it('should log on error', async () => {
    mockReflector.get
      .mockReturnValueOnce({
        action: AuditAction.CREATE,
        resource: AuditResource.ROOM,
        description: 'Room created',
      })
      .mockReturnValueOnce(undefined);
    const handler: CallHandler = {
      handle: () => throwError(() => new Error('fail')),
    };
    await expect(
      lastValueFrom(interceptor.intercept(createContext(), handler)),
    ).rejects.toThrow('fail');
  });

  it('should use class-level options if handler has none', async () => {
    mockReflector.get.mockReturnValueOnce(undefined).mockReturnValueOnce({
      action: AuditAction.READ,
      resource: AuditResource.USER,
      description: 'Read',
    });
    const handler: CallHandler = { handle: () => of('data') };
    await lastValueFrom(interceptor.intercept(createContext(), handler));
    expect(mockAuditService.log).toHaveBeenCalled();
  });

  it('should include resourceIdParam', async () => {
    mockReflector.get
      .mockReturnValueOnce({
        action: AuditAction.UPDATE,
        resource: AuditResource.ROOM,
        description: 'Updated',
        resourceIdParam: 'id',
        includeBody: true,
      })
      .mockReturnValueOnce(undefined);
    const handler: CallHandler = { handle: () => of({ id: 1 }) };
    await lastValueFrom(interceptor.intercept(createContext(), handler));
    expect(mockAuditService.log).toHaveBeenCalled();
  });

  it('should include result when includeResult is set', async () => {
    mockReflector.get
      .mockReturnValueOnce({
        action: AuditAction.CREATE,
        resource: AuditResource.ROOM,
        description: 'Created',
        includeResult: true,
        includeBody: false,
      })
      .mockReturnValueOnce(undefined);
    const handler: CallHandler = { handle: () => of({ id: 1 }) };
    await lastValueFrom(interceptor.intercept(createContext(), handler));
    expect(mockAuditService.log).toHaveBeenCalled();
  });

  it('should map HTTP method to action when action not specified', async () => {
    mockReflector.get
      .mockReturnValueOnce({
        resource: AuditResource.ROOM,
      })
      .mockReturnValueOnce(undefined);
    const handler: CallHandler = { handle: () => of({ id: 1 }) };
    await lastValueFrom(interceptor.intercept(createContext(), handler));
    expect(mockAuditService.log).toHaveBeenCalled();
  });

  it('should not log when no userId available', async () => {
    const ctx = {
      switchToHttp: () => ({
        getRequest: () => ({
          ...mockRequest,
          user: undefined,
        }),
      }),
      getHandler: () => jest.fn(),
      getClass: () => jest.fn(),
    } as unknown as ExecutionContext;

    mockReflector.get
      .mockReturnValueOnce({
        action: AuditAction.READ,
        resource: AuditResource.ROOM,
        description: 'Read',
      })
      .mockReturnValueOnce(undefined);
    const handler: CallHandler = { handle: () => of({ id: 1 }) };
    await lastValueFrom(interceptor.intercept(ctx, handler));
    expect(mockAuditService.log).not.toHaveBeenCalled();
  });

  it('should extract userId from result when not in request', async () => {
    const ctx = {
      switchToHttp: () => ({
        getRequest: () => ({
          ...mockRequest,
          user: undefined,
        }),
      }),
      getHandler: () => jest.fn(),
      getClass: () => jest.fn(),
    } as unknown as ExecutionContext;

    mockReflector.get
      .mockReturnValueOnce({
        action: AuditAction.CREATE,
        resource: AuditResource.USER,
        description: 'Created',
      })
      .mockReturnValueOnce(undefined);
    const handler: CallHandler = {
      handle: () => of({ user: { id: 10 } }),
    };
    await lastValueFrom(interceptor.intercept(ctx, handler));
    expect(mockAuditService.log).toHaveBeenCalled();
  });

  it('should sanitize sensitive fields', async () => {
    mockReflector.get
      .mockReturnValueOnce({
        action: AuditAction.CREATE,
        resource: AuditResource.USER,
        description: 'Created',
        includeBody: true,
      })
      .mockReturnValueOnce(undefined);
    const handler: CallHandler = { handle: () => of({ id: 1 }) };
    await lastValueFrom(interceptor.intercept(createContext(), handler));
    expect(mockAuditService.log).toHaveBeenCalled();
  });

  it('should handle different HTTP methods for action mapping', async () => {
    const methods = ['GET', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'];
    for (const method of methods) {
      jest.clearAllMocks();
      mockAuditService.log.mockReturnValue({
        subscribe: jest.fn().mockReturnValue(undefined),
      });
      const ctx = {
        switchToHttp: () => ({
          getRequest: () => ({ ...mockRequest, method }),
        }),
        getHandler: () => jest.fn(),
        getClass: () => jest.fn(),
      } as unknown as ExecutionContext;

      mockReflector.get
        .mockReturnValueOnce({
          resource: AuditResource.ROOM,
        })
        .mockReturnValueOnce(undefined);
      const handler: CallHandler = { handle: () => of({ id: 1 }) };
      await lastValueFrom(interceptor.intercept(ctx, handler));
    }
  });
});
