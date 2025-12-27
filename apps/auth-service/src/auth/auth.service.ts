import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import {
  RegisterDto,
  AuthResponseDto,
  LoginDto,
  LogoutResponseDto,
  ProfileResponseDto,
  TokenResponseDto,
} from '@app/contracts/auth-service';
import { User, UsersService } from '../users';
import { TokensService } from '../tokens';
import { AccessControlService } from '../access-control';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly tokensService: TokensService,
    private readonly usersService: UsersService,
    private readonly accessControlService: AccessControlService,
  ) {}

  async register(data: RegisterDto): Promise<AuthResponseDto> {
    const { email, password, name, phone, roleId } = data;
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new RpcException({
        statusCode: 409,
        message: 'User already exists',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.userRepository.save({
      email,
      password: hashedPassword,
      name,
      phone,
    });

    const defaultRoleId = await this.usersService.getDefaultRole(roleId);
    await this.usersService.assignSingleRoleToUser(
      user.id,
      defaultRoleId,
      'system',
    );

    const userWithRoles = await this.accessControlService.getUserWithRoles(
      user.id,
    );
    if (!userWithRoles) {
      throw new RpcException({
        statusCode: 500,
        message: 'Failed to create user',
      });
    }

    const tokens = await this.tokensService.getTokens(user.id, user.email);
    await this.tokensService.updateRefreshToken(user.id, tokens.refreshToken);

    const roles = userWithRoles.userRoles.map((userRole) => ({
      id: userRole.role.id,
      name: userRole.role.name,
      description: userRole.role.description || undefined,
    }));

    const permissions = await this.accessControlService.getUserPermissions(
      userWithRoles.id,
    );

    const { refreshToken, userRoles, ...userData } = userWithRoles;
    void refreshToken;
    void userRoles;

    return {
      user: {
        ...userData,
        roles,
        permissions,
      },
      ...tokens,
    };
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const { email, password } = loginDto;

    const user =
      await this.accessControlService.getUserWithRolesAndPassword(email);

    if (!user || !user.isActive) {
      throw new RpcException({
        statusCode: 401,
        message: 'Invalid credentials',
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new RpcException({
        statusCode: 401,
        message: 'Invalid credentials',
      });
    }

    const tokens = await this.tokensService.getTokens(user.id, user.email);
    await this.tokensService.updateRefreshToken(user.id, tokens.refreshToken);

    await this.usersService.updateLastLogin(user.id);

    const permissions = await this.accessControlService.getUserPermissions(
      user.id,
    );

    const roles = user.userRoles.map((userRole) => ({
      id: userRole.role.id,
      name: userRole.role.name,
      description: userRole.role.description || undefined,
    }));

    const { refreshToken, userRoles, ...userData } = user;
    void refreshToken;
    void userRoles;

    return {
      user: {
        ...userData,
        roles,
        permissions,
      },
      ...tokens,
    };
  }

  async logout(userId: number): Promise<LogoutResponseDto> {
    await this.usersService.clearRefreshToken(userId);
    return { message: 'Logged out successfully' };
  }

  async refreshTokens(
    userId: number,
    refreshToken: string,
  ): Promise<TokenResponseDto> {
    const user =
      await this.accessControlService.getUserWithRefreshToken(userId);

    if (!user || !user.refreshToken) {
      throw new RpcException({ statusCode: 403, message: 'Access Denied' });
    }

    const refreshTokenMatches = await bcrypt.compare(
      refreshToken,
      user.refreshToken,
    );

    if (!refreshTokenMatches) {
      throw new RpcException({ statusCode: 403, message: 'Access Denied' });
    }

    const tokens = await this.tokensService.getTokens(user.id, user.email);
    await this.tokensService.updateRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  async getProfile(userId: number): Promise<ProfileResponseDto | null> {
    const user = await this.accessControlService.getUserWithRoles(userId);

    if (!user || !user.isActive) {
      return null;
    }

    const permissions = await this.accessControlService.getUserPermissions(
      user.id,
    );

    const roles = user.userRoles.map((userRole) => ({
      id: userRole.role.id,
      name: userRole.role.name,
      description: userRole.role.description || undefined,
    }));

    const { userRoles, ...result } = user;
    void userRoles;

    return {
      ...result,
      roles,
      permissions,
    };
  }
}
