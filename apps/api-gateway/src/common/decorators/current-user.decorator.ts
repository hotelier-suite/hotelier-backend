import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { JwtUser, JwtRefreshUser } from '@app/contracts/auth-service';

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): JwtUser | JwtRefreshUser => {
    const request = ctx
      .switchToHttp()
      .getRequest<{ user?: JwtUser | JwtRefreshUser }>();
    return (request.user ?? undefined) as JwtUser | JwtRefreshUser;
  },
);
