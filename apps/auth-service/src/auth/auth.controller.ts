import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import {
  AUTH_PATTERNS,
  RegisterDto,
  LoginDto,
  AuthResponseDto,
  LogoutResponseDto,
  ProfileResponseDto,
  TokenResponseDto,
} from '@app/contracts/auth-service';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern(AUTH_PATTERNS.REGISTER)
  register(@Payload() dto: RegisterDto): Promise<AuthResponseDto> {
    return this.authService.register(dto);
  }

  @MessagePattern(AUTH_PATTERNS.LOGIN)
  login(@Payload() dto: LoginDto): Promise<AuthResponseDto> {
    return this.authService.login(dto);
  }

  @MessagePattern(AUTH_PATTERNS.LOGOUT)
  logout(@Payload() userId: number): Promise<LogoutResponseDto> {
    return this.authService.logout(userId);
  }

  @MessagePattern(AUTH_PATTERNS.REFRESH_TOKENS)
  refreshTokens(
    @Payload() payload: { userId: number; refreshToken: string },
  ): Promise<TokenResponseDto> {
    return this.authService.refreshTokens(payload.userId, payload.refreshToken);
  }

  @MessagePattern(AUTH_PATTERNS.GET_PROFILE)
  getProfile(@Payload() userId: number): Promise<ProfileResponseDto | null> {
    return this.authService.validateUser(userId);
  }
}
