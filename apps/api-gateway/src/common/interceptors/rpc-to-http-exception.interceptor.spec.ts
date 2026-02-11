import { CallHandler, ExecutionContext, HttpException } from '@nestjs/common';
import { of, throwError } from 'rxjs';
import { lastValueFrom } from 'rxjs';
import { RpcToHttpExceptionInterceptor } from './';

describe('RpcToHttpExceptionInterceptor', () => {
  let interceptor: RpcToHttpExceptionInterceptor;
  const mockContext = {} as ExecutionContext;

  beforeEach(() => {
    interceptor = new RpcToHttpExceptionInterceptor();
  });

  it('should pass through successful responses', async () => {
    const handler: CallHandler = { handle: () => of({ data: 'ok' }) };
    const result = await lastValueFrom(
      interceptor.intercept(mockContext, handler),
    );
    expect(result).toEqual({ data: 'ok' });
  });

  it('should rethrow HttpException as-is', async () => {
    const httpErr = new HttpException('Bad', 400);
    const handler: CallHandler = {
      handle: () => throwError(() => httpErr),
    };
    await expect(
      lastValueFrom(interceptor.intercept(mockContext, handler)),
    ).rejects.toThrow(HttpException);
  });

  it('should convert error with statusCode and message', async () => {
    const handler: CallHandler = {
      handle: () =>
        throwError(() => ({ statusCode: 404, message: 'Not found' })),
    };
    await expect(
      lastValueFrom(interceptor.intercept(mockContext, handler)),
    ).rejects.toThrow(HttpException);
  });

  it('should convert nested message object', async () => {
    const handler: CallHandler = {
      handle: () =>
        throwError(() => ({
          message: { statusCode: 422, message: 'Validation failed' },
        })),
    };
    await expect(
      lastValueFrom(interceptor.intercept(mockContext, handler)),
    ).rejects.toThrow(HttpException);
  });

  it('should convert nested message with only message field', async () => {
    const handler: CallHandler = {
      handle: () =>
        throwError(() => ({
          message: { message: 'Something went wrong' },
        })),
    };
    await expect(
      lastValueFrom(interceptor.intercept(mockContext, handler)),
    ).rejects.toThrow(HttpException);
  });

  it('should handle string error', async () => {
    const handler: CallHandler = {
      handle: () => throwError(() => 'string error'),
    };
    await expect(
      lastValueFrom(interceptor.intercept(mockContext, handler)),
    ).rejects.toThrow(HttpException);
  });

  it('should handle error with only message string', async () => {
    const handler: CallHandler = {
      handle: () => throwError(() => ({ message: 'generic error' })),
    };
    await expect(
      lastValueFrom(interceptor.intercept(mockContext, handler)),
    ).rejects.toThrow(HttpException);
  });

  it('should handle error with error field', async () => {
    const handler: CallHandler = {
      handle: () => throwError(() => ({ error: 'some error' })),
    };
    await expect(
      lastValueFrom(interceptor.intercept(mockContext, handler)),
    ).rejects.toThrow(HttpException);
  });

  it('should handle null error', async () => {
    const handler: CallHandler = {
      handle: () => throwError(() => null),
    };
    await expect(
      lastValueFrom(interceptor.intercept(mockContext, handler)),
    ).rejects.toThrow(HttpException);
  });

  it('should handle empty object error', async () => {
    const handler: CallHandler = {
      handle: () => throwError(() => ({})),
    };
    await expect(
      lastValueFrom(interceptor.intercept(mockContext, handler)),
    ).rejects.toThrow(HttpException);
  });
});
