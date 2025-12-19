import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { JwtPayload } from '@app/contracts/auth-service/tokens/interfaces/jwt-payload.interface';
import type { JwtUser } from '@app/contracts/auth-service/tokens/interfaces/jwt-user.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey:
        configService.get<string>('JWT_SECRET') ||
        'your-super-secret-jwt-key-change-in-production',
    });
  }

  validate(payload: JwtPayload): JwtUser {
    if (!payload || !payload.sub) {
      throw new UnauthorizedException('Invalid token payload');
    }
    // Return user object that will be attached to request.user
    return { id: payload.sub, email: payload.email };
  }
}
