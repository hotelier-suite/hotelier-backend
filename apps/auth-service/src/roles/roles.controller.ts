import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ROLES_PATTERNS } from '@app/contracts/auth-service/roles/roles.patterns';
import { CreateRoleDto } from '@app/contracts/auth-service/roles/dto/create-role.dto';
import { UpdateRoleDto } from '@app/contracts/auth-service/roles/dto/update-role.dto';
import { RolesService } from './roles.service';

@Controller()
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @MessagePattern(ROLES_PATTERNS.CREATE)
  createRole(@Payload() dto: CreateRoleDto) {
    return this.rolesService.createRole(dto);
  }

  @MessagePattern(ROLES_PATTERNS.FIND_ALL)
  findAllRoles() {
    return this.rolesService.findAllRoles();
  }

  @MessagePattern(ROLES_PATTERNS.FIND_BY_ID)
  findRoleById(@Payload() id: number) {
    return this.rolesService.findRoleById(id);
  }

  @MessagePattern(ROLES_PATTERNS.FIND_BY_NAME)
  findRoleByName(@Payload() name: string) {
    return this.rolesService.findRoleByName(name);
  }

  @MessagePattern(ROLES_PATTERNS.UPDATE)
  updateRole(@Payload() payload: { id: number; data: UpdateRoleDto }) {
    return this.rolesService.updateRole(payload.id, payload.data);
  }

  @MessagePattern(ROLES_PATTERNS.DELETE)
  deleteRole(@Payload() id: number) {
    return this.rolesService.deleteRole(id);
  }

  @MessagePattern(ROLES_PATTERNS.ASSIGN_PERMISSIONS)
  assignPermissionsToRole(
    @Payload() payload: { roleId: number; permissionIds: number[] },
  ) {
    return this.rolesService.assignPermissionsToRole(
      payload.roleId,
      payload.permissionIds,
    );
  }

  @MessagePattern(ROLES_PATTERNS.REMOVE_PERMISSIONS)
  removePermissionsFromRole(
    @Payload() payload: { roleId: number; permissionIds: number[] },
  ) {
    return this.rolesService.removePermissionsFromRole(
      payload.roleId,
      payload.permissionIds,
    );
  }
}
