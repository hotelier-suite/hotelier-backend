import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { RolesService } from './roles.service';
import {
  ROLES_PATTERNS,
  CreateRoleDto,
  UpdateRoleDto,
  RoleResponseDto,
} from '@app/contracts/auth-service';

@Controller()
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @MessagePattern(ROLES_PATTERNS.CREATE)
  create(@Payload() dto: CreateRoleDto): Promise<RoleResponseDto> {
    return this.rolesService.create(dto);
  }

  @MessagePattern(ROLES_PATTERNS.FIND_ALL)
  findAll(): Promise<RoleResponseDto[]> {
    return this.rolesService.findAll();
  }

  @MessagePattern(ROLES_PATTERNS.FIND_ONE)
  findOne(@Payload() id: number): Promise<RoleResponseDto> {
    return this.rolesService.findOne(id);
  }

  @MessagePattern(ROLES_PATTERNS.FIND_BY_NAME)
  findByName(@Payload() name: string): Promise<RoleResponseDto> {
    return this.rolesService.findByName(name);
  }

  @MessagePattern(ROLES_PATTERNS.UPDATE)
  update(
    @Payload() payload: { id: number; data: UpdateRoleDto },
  ): Promise<RoleResponseDto> {
    return this.rolesService.update(payload.id, payload.data);
  }

  @MessagePattern(ROLES_PATTERNS.DELETE)
  remove(@Payload() id: number): Promise<RoleResponseDto> {
    return this.rolesService.remove(id);
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
