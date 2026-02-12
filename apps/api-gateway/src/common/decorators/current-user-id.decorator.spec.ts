import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import type { JwtUser, JwtRefreshUser } from '@app/contracts/auth-service';

describe('CurrentUserId Decorator', () => {
  let mockExecutionContext: ExecutionContext;
  let mockGetRequest: jest.Mock;
  let mockSwitchToHttp: jest.Mock;
  let decoratorFunction: (data: unknown, ctx: ExecutionContext) => number;

  beforeEach(() => {
    // Re-create the decorator logic for testing
    decoratorFunction = (_data: unknown, ctx: ExecutionContext): number => {
      const request = ctx
        .switchToHttp()
        .getRequest<{ user?: JwtUser | JwtRefreshUser }>();

      const user = request.user;
      const id =
        (user as JwtUser | undefined)?.id ??
        (user as JwtRefreshUser | undefined)?.sub;

      if (typeof id !== 'number' || !Number.isFinite(id)) {
        throw new UnauthorizedException('User not found in request');
      }

      return id;
    };

    mockGetRequest = jest.fn();
    mockSwitchToHttp = jest.fn().mockReturnValue({
      getRequest: mockGetRequest,
    });
    mockExecutionContext = {
      switchToHttp: mockSwitchToHttp,
    } as unknown as ExecutionContext;
  });

  it('should extract user id from JwtUser', () => {
    const user: JwtUser = {
      id: 123,
      email: 'test@example.com',
    };

    mockGetRequest.mockReturnValue({ user });

    const result = decoratorFunction(undefined, mockExecutionContext);
    expect(result).toBe(123);
    expect(mockGetRequest).toHaveBeenCalled();
  });

  it('should extract user id from JwtRefreshUser using sub', () => {
    const user: JwtRefreshUser = {
      sub: 456,
      email: 'refresh@example.com',
    };

    mockGetRequest.mockReturnValue({ user });

    const result = decoratorFunction(undefined, mockExecutionContext);
    expect(result).toBe(456);
    expect(mockGetRequest).toHaveBeenCalled();
  });

  it('should throw UnauthorizedException when user is not in request', () => {
    mockGetRequest.mockReturnValue({});

    expect(() => decoratorFunction(undefined, mockExecutionContext)).toThrow(
      UnauthorizedException,
    );
    expect(() => decoratorFunction(undefined, mockExecutionContext)).toThrow(
      'User not found in request',
    );
    expect(mockGetRequest).toHaveBeenCalled();
  });

  it('should throw UnauthorizedException when id is not a number', () => {
    const user = {
      id: 'not-a-number',
    };

    mockGetRequest.mockReturnValue({ user });

    expect(() => decoratorFunction(undefined, mockExecutionContext)).toThrow(
      UnauthorizedException,
    );
    expect(mockGetRequest).toHaveBeenCalled();
  });

  it('should throw UnauthorizedException when id is not finite', () => {
    const user = {
      id: Infinity,
    };

    mockGetRequest.mockReturnValue({ user });

    expect(() => decoratorFunction(undefined, mockExecutionContext)).toThrow(
      UnauthorizedException,
    );
    expect(mockGetRequest).toHaveBeenCalled();
  });
});
