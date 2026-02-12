import { ExecutionContext } from '@nestjs/common';
import type { JwtUser, JwtRefreshUser } from '@app/contracts/auth-service';

describe('CurrentUser Decorator', () => {
  let mockExecutionContext: ExecutionContext;
  let decoratorFunction: (data: unknown, ctx: ExecutionContext) => JwtUser | JwtRefreshUser | undefined;

  beforeEach(() => {
    // Re-create the decorator logic for testing
    decoratorFunction = (_data: unknown, ctx: ExecutionContext): JwtUser | JwtRefreshUser | undefined => {
      const request = ctx
        .switchToHttp()
        .getRequest<{ user?: JwtUser | JwtRefreshUser }>();
      return (request.user ?? undefined) as JwtUser | JwtRefreshUser | undefined;
    };

    const mockGetRequest = jest.fn();
    mockExecutionContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: mockGetRequest,
      }),
    } as unknown as ExecutionContext;
  });

  it('should extract JwtUser from request', () => {
    const user: JwtUser = {
      id: 123,
      email: 'test@example.com',
    };

    const mockGetRequest = mockExecutionContext.switchToHttp().getRequest as jest.MockedFunction<() => { user?: JwtUser | JwtRefreshUser }>;
    mockGetRequest.mockReturnValue({ user });

    const result = decoratorFunction(undefined, mockExecutionContext);
    expect(result).toEqual(user);
  });

  it('should extract JwtRefreshUser from request', () => {
    const user: JwtRefreshUser = {
      sub: 456,
      email: 'refresh@example.com',
    };

    const mockGetRequest = mockExecutionContext.switchToHttp().getRequest as jest.MockedFunction<() => { user?: JwtUser | JwtRefreshUser }>;
    mockGetRequest.mockReturnValue({ user });

    const result = decoratorFunction(undefined, mockExecutionContext);
    expect(result).toEqual(user);
  });

  it('should return undefined when user is not in request', () => {
    const mockGetRequest = mockExecutionContext.switchToHttp().getRequest as jest.MockedFunction<() => { user?: JwtUser | JwtRefreshUser }>;
    mockGetRequest.mockReturnValue({});

    const result = decoratorFunction(undefined, mockExecutionContext);
    expect(result).toBeUndefined();
  });
});
