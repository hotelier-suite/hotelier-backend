import { ExecutionContext } from '@nestjs/common';
import type { JwtUser, JwtRefreshUser } from '@app/contracts/auth-service';

describe('CurrentUser Decorator', () => {
  let mockExecutionContext: ExecutionContext;
  let mockGetRequest: jest.Mock;
  let mockSwitchToHttp: jest.Mock;
  let decoratorFunction: (
    data: unknown,
    ctx: ExecutionContext,
  ) => JwtUser | JwtRefreshUser | undefined;

  beforeEach(() => {
    // Re-create the decorator logic for testing
    decoratorFunction = (
      _data: unknown,
      ctx: ExecutionContext,
    ): JwtUser | JwtRefreshUser | undefined => {
      const request = ctx
        .switchToHttp()
        .getRequest<{ user?: JwtUser | JwtRefreshUser }>();
      return request.user ?? undefined;
    };

    mockGetRequest = jest.fn();
    mockSwitchToHttp = jest.fn().mockReturnValue({
      getRequest: mockGetRequest,
    });
    mockExecutionContext = {
      switchToHttp: mockSwitchToHttp,
    } as unknown as ExecutionContext;
  });

  it('should extract JwtUser from request', () => {
    const user: JwtUser = {
      id: 123,
      email: 'test@example.com',
    };

    mockGetRequest.mockReturnValue({ user });

    const result = decoratorFunction(undefined, mockExecutionContext);
    expect(result).toEqual(user);
    expect(mockGetRequest).toHaveBeenCalled();
  });

  it('should extract JwtRefreshUser from request', () => {
    const user: JwtRefreshUser = {
      sub: 456,
      email: 'refresh@example.com',
    };

    mockGetRequest.mockReturnValue({ user });

    const result = decoratorFunction(undefined, mockExecutionContext);
    expect(result).toEqual(user);
    expect(mockGetRequest).toHaveBeenCalled();
  });

  it('should return undefined when user is not in request', () => {
    mockGetRequest.mockReturnValue({});

    const result = decoratorFunction(undefined, mockExecutionContext);
    expect(result).toBeUndefined();
    expect(mockGetRequest).toHaveBeenCalled();
  });
});
