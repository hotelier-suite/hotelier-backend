import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { JwtUser } from '@app/contracts/auth-service/tokens/interfaces/jwt-user.interface';
import type { JwtRefreshUser } from '@app/contracts/auth-service/tokens/interfaces/jwt-refresh-user.interface';

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): JwtUser | JwtRefreshUser => {
    const request = ctx
      .switchToHttp()
      .getRequest<{ user?: JwtUser | JwtRefreshUser }>();
    return (request.user ?? undefined) as JwtUser | JwtRefreshUser;
  },
);
