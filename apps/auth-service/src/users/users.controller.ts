import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UsersService } from './users.service';
import {
  USERS_PATTERNS,
  UserResponseDto,
  RoleResponseDto,
  PermissionResponseDto,
  FindUsersFilterDto,
} from '@app/contracts/auth-service';
import { User } from './entities';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @MessagePattern(USERS_PATTERNS.FIND_ALL)
  findAll(@Payload() filters: FindUsersFilterDto): Promise<UserResponseDto[]> {
    return this.usersService.findAll(filters);
  }

  @MessagePattern(USERS_PATTERNS.FIND_ONE)
  findOne(@Payload() id: number): Promise<UserResponseDto> {
    return this.usersService.findOne(id);
  }

  @MessagePattern(USERS_PATTERNS.CREATE)
  create(@Payload() data: Partial<User>): Promise<UserResponseDto> {
    return this.usersService.create(data);
  }

  @MessagePattern(USERS_PATTERNS.UPDATE)
  update(
    @Payload()
    payload: {
      id: number;
      data: Partial<User>;
    },
  ): Promise<UserResponseDto> {
    return this.usersService.update(payload.id, payload.data);
  }

  @MessagePattern(USERS_PATTERNS.DELETE)
  remove(@Payload() id: number): Promise<UserResponseDto> {
    return this.usersService.remove(id);
  }

  @MessagePattern(USERS_PATTERNS.REMOVE_ROLES)
  removeRolesFromUser(
    @Payload() payload: { userId: number; roleIds: number[] },
  ): Promise<void> {
    return this.usersService.removeRolesFromUser(
      payload.userId,
      payload.roleIds,
    );
  }

  @MessagePattern(USERS_PATTERNS.GET_ROLES)
  getUserRoles(@Payload() userId: number): Promise<RoleResponseDto[]> {
    return this.usersService.getUserRoles(userId);
  }

  @MessagePattern(USERS_PATTERNS.GET_PERMISSIONS)
  getUserPermissions(
    @Payload() userId: number,
  ): Promise<PermissionResponseDto[]> {
    return this.usersService.getUserPermissionsList(userId);
  }
}
