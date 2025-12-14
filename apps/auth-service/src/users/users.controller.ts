import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { USERS_PATTERNS } from '@app/contracts/auth-service/users/users.patterns';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @MessagePattern(USERS_PATTERNS.FIND_ALL)
  findAllUsers() {
    return this.usersService.findAllUsers();
  }

  @MessagePattern(USERS_PATTERNS.FIND_BY_ID)
  findUserById(@Payload() id: number) {
    return this.usersService.findUserById(id);
  }

  @MessagePattern(USERS_PATTERNS.CREATE)
  createUser(@Payload() data: Partial<User>) {
    return this.usersService.createUser(data);
  }

  @MessagePattern(USERS_PATTERNS.UPDATE)
  updateUser(
    @Payload()
    payload: {
      id: number;
      data: Partial<User>;
    },
  ) {
    return this.usersService.updateUser(payload.id, payload.data);
  }

  @MessagePattern(USERS_PATTERNS.DELETE)
  deleteUser(@Payload() id: number) {
    return this.usersService.deleteUser(id);
  }

  @MessagePattern(USERS_PATTERNS.ACTIVATE)
  activateUser(@Payload() id: number) {
    return this.usersService.activateUser(id);
  }

  @MessagePattern(USERS_PATTERNS.DEACTIVATE)
  deactivateUser(@Payload() id: number) {
    return this.usersService.deactivateUser(id);
  }

  @MessagePattern(USERS_PATTERNS.ASSIGN_ROLES)
  assignRolesToUser(@Payload() payload: { userId: number; roleIds: number[] }) {
    return this.usersService.assignRolesToUser(payload.userId, payload.roleIds);
  }

  @MessagePattern(USERS_PATTERNS.REMOVE_ROLES)
  removeRolesFromUser(
    @Payload() payload: { userId: number; roleIds: number[] },
  ) {
    return this.usersService.removeRolesFromUser(
      payload.userId,
      payload.roleIds,
    );
  }

  @MessagePattern(USERS_PATTERNS.GET_ROLES)
  getUserRoles(@Payload() userId: number) {
    return this.usersService.getUserRoles(userId);
  }

  @MessagePattern(USERS_PATTERNS.GET_PERMISSIONS)
  getUserPermissions(@Payload() userId: number) {
    return this.usersService.getUserPermissionsList(userId);
  }
}
