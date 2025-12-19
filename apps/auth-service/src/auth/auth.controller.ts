import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AUTH_PATTERNS } from '@app/contracts/auth-service/auth/auth.patterns';
import { AuthService } from './auth.service';
import { RegisterDto } from '@app/contracts/auth-service/auth/dto/register.dto';
import { LoginDto } from '@app/contracts/auth-service/auth/dto/login.dto';
import { AuthResponseDto } from '@app/contracts/auth-service/auth/dto/auth-response.dto';
import { LogoutResponseDto } from '@app/contracts/auth-service/auth/dto/logout-response.dto';
import { TokenResponseDto } from '@app/contracts/auth-service/tokens/dto/token-response.dto';
import { ProfileResponseDto } from '@app/contracts/auth-service/auth/dto/profile-response.dto';

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
