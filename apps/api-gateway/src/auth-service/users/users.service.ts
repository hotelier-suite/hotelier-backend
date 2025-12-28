import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  USERS_PATTERNS,
  UserResponseDto,
  CreateUserDto,
  UpdateUserDto,
  UserRolesPayloadDto,
  RoleResponseDto,
  PermissionResponseDto,
  FindUsersFilterDto,
} from '@app/contracts/auth-service';
import { Observable } from 'rxjs';
import { AUTH_SERVICE_CLIENT } from '../constants';

@Injectable()
export class UsersService {
  constructor(
    @Inject(AUTH_SERVICE_CLIENT) private readonly authClient: ClientProxy,
  ) {}

  findAll(filters: FindUsersFilterDto): Observable<UserResponseDto[]> {
    return this.authClient.send<UserResponseDto[], FindUsersFilterDto>(
      USERS_PATTERNS.FIND_ALL,
      filters,
    );
  }

  findOne(id: number): Observable<UserResponseDto> {
    return this.authClient.send<UserResponseDto, number>(
      USERS_PATTERNS.FIND_ONE,
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
