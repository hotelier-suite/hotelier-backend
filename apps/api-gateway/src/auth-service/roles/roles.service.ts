import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { PERMISSIONS_PATTERNS } from '@app/contracts/auth-service/permissions/permissions.patterns';
import { PermissionResponseDto } from '@app/contracts/auth-service/permissions/dto/permission-response.dto';
import { CreatePermissionDto } from '@app/contracts/auth-service/permissions/dto/create-permission.dto';
import { RoleResponseDto } from '@app/contracts/auth-service/roles/dto/role-response.dto';
import { ROLES_PATTERNS } from '@app/contracts/auth-service/roles/roles.patterns';
import { CreateRoleDto } from '@app/contracts/auth-service/roles/dto/create-role.dto';
import { UpdateRoleDto } from '@app/contracts/auth-service/roles/dto/update-role.dto';
import { RolePermissionsPayloadDto } from '@app/contracts/auth-service/roles/dto/role-permissions-payload.dto';
import { UpdatePermissionDto } from '@app/contracts/auth-service/permissions/dto/update-permission.dto';
import { Observable } from 'rxjs';
import { AUTH_SERVICE_CLIENT } from '../constants';

@Injectable()
export class RolesService {
  constructor(
    @Inject(AUTH_SERVICE_CLIENT) private readonly authClient: ClientProxy,
  ) {}

  createRole(data: CreateRoleDto): Observable<RoleResponseDto> {
    return this.authClient.send<RoleResponseDto, CreateRoleDto>(
      ROLES_PATTERNS.CREATE,
      data,
    );
  }

  findAllRoles(): Observable<RoleResponseDto[]> {
    return this.authClient.send<RoleResponseDto[], Record<string, never>>(
      ROLES_PATTERNS.FIND_ALL,
      {},
    );
  }

  findRoleById(id: number): Observable<RoleResponseDto> {
    return this.authClient.send<RoleResponseDto, number>(
      ROLES_PATTERNS.FIND_BY_ID,
      id,
    );
  }

  findRoleByName(name: string): Observable<RoleResponseDto> {
    return this.authClient.send<RoleResponseDto, string>(
      ROLES_PATTERNS.FIND_BY_NAME,
      name,
    );
  }

  updateRole(id: number, data: UpdateRoleDto): Observable<RoleResponseDto> {
    return this.authClient.send<
      RoleResponseDto,
      { id: number; data: UpdateRoleDto }
    >(ROLES_PATTERNS.UPDATE, { id, data });
  }

  deleteRole(id: number): Observable<RoleResponseDto> {
    return this.authClient.send<RoleResponseDto, number>(
      ROLES_PATTERNS.DELETE,
      id,
    );
  }

  assignPermissionsToRole(
    roleId: number,
    permissionIds: number[],
  ): Observable<void> {
    return this.authClient.send<void, RolePermissionsPayloadDto>(
      ROLES_PATTERNS.ASSIGN_PERMISSIONS,
      { roleId, permissionIds },
    );
  }

  removePermissionsFromRole(
    roleId: number,
    permissionIds: number[],
  ): Observable<void> {
    return this.authClient.send<void, RolePermissionsPayloadDto>(
      ROLES_PATTERNS.REMOVE_PERMISSIONS,
      { roleId, permissionIds },
    );
  }

  findAllPermissions(): Observable<PermissionResponseDto[]> {
    return this.authClient.send<PermissionResponseDto[], Record<string, never>>(
      PERMISSIONS_PATTERNS.FIND_ALL,
      {},
    );
  }

  getPermissionsByResource(): Observable<
    Record<string, PermissionResponseDto[]>
  > {
    return this.authClient.send<
      Record<string, PermissionResponseDto[]>,
      Record<string, never>
    >(PERMISSIONS_PATTERNS.BY_RESOURCE, {});
  }

  createPermission(
    data: CreatePermissionDto,
  ): Observable<PermissionResponseDto> {
    return this.authClient.send<PermissionResponseDto, CreatePermissionDto>(
      PERMISSIONS_PATTERNS.CREATE,
      data,
    );
  }

  updatePermission(
    id: number,
    data: UpdatePermissionDto,
  ): Observable<PermissionResponseDto> {
    return this.authClient.send<
      PermissionResponseDto,
      { id: number; data: UpdatePermissionDto }
    >(PERMISSIONS_PATTERNS.UPDATE, { id, data });
  }

  deletePermission(id: number): Observable<PermissionResponseDto> {
    return this.authClient.send<PermissionResponseDto, number>(
      PERMISSIONS_PATTERNS.DELETE,
      id,
    );
  }
}
