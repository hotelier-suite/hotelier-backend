import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ROLES_PATTERNS } from '@app/contracts/auth-service/roles/roles.patterns';
import { CreateRoleDto } from '@app/contracts/auth-service/roles/dto/create-role.dto';
import { UpdateRoleDto } from '@app/contracts/auth-service/roles/dto/update-role.dto';
import { RoleResponseDto } from '@app/contracts/auth-service/roles/dto/role-response.dto';
import { RolesService } from './roles.service';

@Controller()
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @MessagePattern(ROLES_PATTERNS.CREATE)
  createRole(@Payload() dto: CreateRoleDto): Promise<RoleResponseDto> {
    return this.rolesService.createRole(dto);
  }

  @MessagePattern(ROLES_PATTERNS.FIND_ALL)
  findAllRoles(): Promise<RoleResponseDto[]> {
    return this.rolesService.findAllRoles();
  }

  @MessagePattern(ROLES_PATTERNS.FIND_BY_ID)
  findRoleById(@Payload() id: number): Promise<RoleResponseDto> {
    return this.rolesService.findRoleById(id);
  }

  @MessagePattern(ROLES_PATTERNS.FIND_BY_NAME)
  findRoleByName(@Payload() name: string): Promise<RoleResponseDto> {
    return this.rolesService.findRoleByName(name);
  }

  @MessagePattern(ROLES_PATTERNS.UPDATE)
  updateRole(
    @Payload() payload: { id: number; data: UpdateRoleDto },
  ): Promise<RoleResponseDto> {
    return this.rolesService.updateRole(payload.id, payload.data);
  }

  @MessagePattern(ROLES_PATTERNS.DELETE)
  deleteRole(@Payload() id: number): Promise<RoleResponseDto> {
    return this.rolesService.deleteRole(id);
  }

  @MessagePattern(ROLES_PATTERNS.ASSIGN_PERMISSIONS)
  assignPermissionsToRole(
    @Payload() payload: { roleId: number; permissionIds: number[] },
  ): Promise<void> {
    return this.rolesService.assignPermissionsToRole(
      payload.roleId,
      payload.permissionIds,
    );
  }

  @MessagePattern(ROLES_PATTERNS.REMOVE_PERMISSIONS)
  removePermissionsFromRole(
    @Payload() payload: { roleId: number; permissionIds: number[] },
  ): Promise<void> {
    return this.rolesService.removePermissionsFromRole(
      payload.roleId,
      payload.permissionIds,
    );
  }
}
