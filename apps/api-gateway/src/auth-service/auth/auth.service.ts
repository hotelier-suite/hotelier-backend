import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { AUTH_PATTERNS } from '@app/contracts/auth-service/auth/auth.patterns';
import { RegisterDto } from '@app/contracts/auth-service/auth/dto/register.dto';
import { AuthResponseDto } from '@app/contracts/auth-service/auth/dto/auth-response.dto';
import { LoginDto } from '@app/contracts/auth-service/auth/dto/login.dto';
import { TokenResponseDto } from '@app/contracts/auth-service/tokens/dto/token-response.dto';
import { LogoutResponseDto } from '@app/contracts/auth-service/auth/dto/logout-response.dto';
import { ProfileResponseDto } from '@app/contracts/auth-service/auth/dto/profile-response.dto';
import { AUTH_SERVICE_CLIENT } from '../constants';

@Injectable()
export class AuthService {
  constructor(
    @Inject(AUTH_SERVICE_CLIENT) private readonly authClient: ClientProxy,
  ) {}

  register(data: RegisterDto): Observable<AuthResponseDto> {
    return this.authClient.send<AuthResponseDto, RegisterDto>(
      AUTH_PATTERNS.REGISTER,
      data,
    );
  }

  login(data: LoginDto): Observable<AuthResponseDto> {
    return this.authClient.send<AuthResponseDto, LoginDto>(
      AUTH_PATTERNS.LOGIN,
      data,
    );
  }

  logout(userId: number): Observable<LogoutResponseDto> {
    return this.authClient.send<LogoutResponseDto, number>(
      AUTH_PATTERNS.LOGOUT,
      userId,
    );
  }

  refreshTokens(
    userId: number,
    refreshToken: string,
  ): Observable<TokenResponseDto> {
    return this.authClient.send<
      TokenResponseDto,
      { userId: number; refreshToken: string }
    >(AUTH_PATTERNS.REFRESH_TOKENS, { userId, refreshToken });
  }

  validateUser(userId: number): Observable<ProfileResponseDto | null> {
    return this.authClient.send<ProfileResponseDto | null, number>(
      AUTH_PATTERNS.GET_PROFILE,
      userId,
    );
  }
}
