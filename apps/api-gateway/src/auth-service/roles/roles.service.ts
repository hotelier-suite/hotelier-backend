import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { RoleResponseDto } from '@app/contracts/auth-service/roles/dto/role-response.dto';
import { ROLES_PATTERNS } from '@app/contracts/auth-service/roles/roles.patterns';
import { CreateRoleDto } from '@app/contracts/auth-service/roles/dto/create-role.dto';
import { UpdateRoleDto } from '@app/contracts/auth-service/roles/dto/update-role.dto';
import { RolePermissionsPayloadDto } from '@app/contracts/auth-service/roles/dto/role-permissions-payload.dto';
import { Observable } from 'rxjs';
import { AUTH_SERVICE_CLIENT } from '../constants';

@Injectable()
export class RolesService {
  constructor(
    @Inject(AUTH_SERVICE_CLIENT) private readonly authClient: ClientProxy,
  ) {}

  create(data: CreateRoleDto): Observable<RoleResponseDto> {
    return this.authClient.send<RoleResponseDto, CreateRoleDto>(
      ROLES_PATTERNS.CREATE,
      data,
    );
  }

  findAll(): Observable<RoleResponseDto[]> {
    return this.authClient.send<RoleResponseDto[], Record<string, never>>(
      ROLES_PATTERNS.FIND_ALL,
      {},
    );
  }

  findOne(id: number): Observable<RoleResponseDto> {
    return this.authClient.send<RoleResponseDto, number>(
      ROLES_PATTERNS.FIND_BY_ID,
      id,
    );
  }

  findByName(name: string): Observable<RoleResponseDto> {
    return this.authClient.send<RoleResponseDto, string>(
      ROLES_PATTERNS.FIND_BY_NAME,
      name,
    );
  }

  update(id: number, data: UpdateRoleDto): Observable<RoleResponseDto> {
    return this.authClient.send<
      RoleResponseDto,
      { id: number; data: UpdateRoleDto }
    >(ROLES_PATTERNS.UPDATE, { id, data });
  }

  remove(id: number): Observable<RoleResponseDto> {
    return this.authClient.send<RoleResponseDto, number>(
      ROLES_PATTERNS.DELETE,
      id,
    );
  }

  assignPermissions(roleId: number, permissionIds: number[]): Observable<void> {
    return this.authClient.send<void, RolePermissionsPayloadDto>(
      ROLES_PATTERNS.ASSIGN_PERMISSIONS,
      { roleId, permissionIds },
    );
  }

  removePermissions(roleId: number, permissionIds: number[]): Observable<void> {
    return this.authClient.send<void, RolePermissionsPayloadDto>(
      ROLES_PATTERNS.REMOVE_PERMISSIONS,
      { roleId, permissionIds },
    );
  }
}
