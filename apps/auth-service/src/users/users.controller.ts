import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UsersService } from './users.service';
import {
  USERS_PATTERNS,
  UserResponseDto,
  RoleResponseDto,
  PermissionResponseDto,
} from '@app/contracts/auth-service';
import { User } from './entities';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @MessagePattern(USERS_PATTERNS.FIND_ALL)
  findAll(): Promise<UserResponseDto[]> {
    return this.usersService.findAll();
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

  @MessagePattern(USERS_PATTERNS.ACTIVATE)
  activate(@Payload() id: number): Promise<UserResponseDto> {
    return this.usersService.activate(id);
  }

  @MessagePattern(USERS_PATTERNS.DEACTIVATE)
  deactivate(@Payload() id: number): Promise<UserResponseDto> {
    return this.usersService.deactivate(id);
  }

  @MessagePattern(USERS_PATTERNS.ASSIGN_ROLES)
  assignRolesToUser(
    @Payload() payload: { userId: number; roleIds: number[] },
  ): Promise<void> {
    return this.usersService.assignRolesToUser(payload.userId, payload.roleIds);
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
