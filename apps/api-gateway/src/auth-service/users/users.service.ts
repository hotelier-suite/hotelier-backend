import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { USERS_PATTERNS } from '@app/contracts/auth-service/users/users.patterns';
import { UserResponseDto } from '@app/contracts/auth-service/users/dto/user-response.dto';
import { CreateUserDto } from '@app/contracts/auth-service/users/dto/create-user.dto';
import { UpdateUserDto } from '@app/contracts/auth-service/users/dto/update-user.dto';
import { UserRolesPayloadDto } from '@app/contracts/auth-service/users/dto/user-roles-payload.dto';
import { RoleResponseDto } from '@app/contracts/auth-service/roles/dto/role-response.dto';
import { PermissionResponseDto } from '@app/contracts/auth-service/permissions/dto/permission-response.dto';
import { Observable } from 'rxjs';
import { AUTH_SERVICE_CLIENT } from '../constants';

@Injectable()
export class UsersService {
  constructor(
    @Inject(AUTH_SERVICE_CLIENT) private readonly authClient: ClientProxy,
  ) {}

  findAll(): Observable<UserResponseDto[]> {
    return this.authClient.send<UserResponseDto[], Record<string, never>>(
      USERS_PATTERNS.FIND_ALL,
      {},
    );
  }

  findOne(id: number): Observable<UserResponseDto> {
    return this.authClient.send<UserResponseDto, number>(
      USERS_PATTERNS.FIND_BY_ID,
      id,
    );
  }

  create(userData: CreateUserDto): Observable<UserResponseDto> {
    return this.authClient.send<UserResponseDto, CreateUserDto>(
      USERS_PATTERNS.CREATE,
      userData,
    );
  }

  update(id: number, userData: UpdateUserDto): Observable<UserResponseDto> {
    return this.authClient.send<
      UserResponseDto,
      { id: number; data: UpdateUserDto }
    >(USERS_PATTERNS.UPDATE, { id, data: userData });
  }

  remove(id: number): Observable<UserResponseDto> {
    return this.authClient.send<UserResponseDto, number>(
      USERS_PATTERNS.DELETE,
      id,
    );
  }

  activate(id: number): Observable<UserResponseDto> {
    return this.authClient.send<UserResponseDto, number>(
      USERS_PATTERNS.ACTIVATE,
      id,
    );
  }

  deactivate(id: number): Observable<UserResponseDto> {
    return this.authClient.send<UserResponseDto, number>(
      USERS_PATTERNS.DEACTIVATE,
      id,
    );
  }

  assignRolesToUser(userId: number, roleIds: number[]): Observable<void> {
    return this.authClient.send<void, UserRolesPayloadDto>(
      USERS_PATTERNS.ASSIGN_ROLES,
      { userId, roleIds },
    );
  }

  removeRolesFromUser(userId: number, roleIds: number[]): Observable<void> {
    return this.authClient.send<void, UserRolesPayloadDto>(
      USERS_PATTERNS.REMOVE_ROLES,
      { userId, roleIds },
    );
  }

  getUserRoles(userId: number): Observable<RoleResponseDto[]> {
    return this.authClient.send<RoleResponseDto[], number>(
      USERS_PATTERNS.GET_ROLES,
      userId,
    );
  }

  getUserPermissions(userId: number): Observable<PermissionResponseDto[]> {
    return this.authClient.send<PermissionResponseDto[], number>(
      USERS_PATTERNS.GET_PERMISSIONS,
      userId,
    );
  }
}
