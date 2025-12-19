import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { USERS_PATTERNS } from '@app/contracts/auth-service/users/users.patterns';
import { UsersService } from './users.service';
import { UserResponseDto } from '@app/contracts/auth-service/users/dto/user-response.dto';
import { RoleResponseDto } from '@app/contracts/auth-service/roles/dto/role-response.dto';
import { PermissionResponseDto } from '@app/contracts/auth-service/permissions/dto/permission-response.dto';
import { User } from './entities/user.entity';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @MessagePattern(USERS_PATTERNS.FIND_ALL)
  findAllUsers(): Promise<UserResponseDto[]> {
    return this.usersService.findAllUsers();
  }

  @MessagePattern(USERS_PATTERNS.FIND_BY_ID)
  findUserById(@Payload() id: number): Promise<UserResponseDto> {
    return this.usersService.findUserById(id);
  }

  @MessagePattern(USERS_PATTERNS.CREATE)
  createUser(@Payload() data: Partial<User>): Promise<UserResponseDto> {
    return this.usersService.createUser(data);
  }

  @MessagePattern(USERS_PATTERNS.UPDATE)
  updateUser(
    @Payload()
    payload: {
      id: number;
      data: Partial<User>;
    },
  ): Promise<UserResponseDto> {
    return this.usersService.updateUser(payload.id, payload.data);
  }

  @MessagePattern(USERS_PATTERNS.DELETE)
  deleteUser(@Payload() id: number): Promise<UserResponseDto> {
    return this.usersService.deleteUser(id);
  }

  @MessagePattern(USERS_PATTERNS.ACTIVATE)
  activateUser(@Payload() id: number): Promise<UserResponseDto> {
    return this.usersService.activateUser(id);
  }

  @MessagePattern(USERS_PATTERNS.DEACTIVATE)
  deactivateUser(@Payload() id: number): Promise<UserResponseDto> {
    return this.usersService.deactivateUser(id);
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
