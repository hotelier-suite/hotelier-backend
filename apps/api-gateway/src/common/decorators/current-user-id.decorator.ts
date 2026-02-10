import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import type { JwtUser, JwtRefreshUser } from '@app/contracts/auth-service';

export const CurrentUserId = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): number => {
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
  },
);
