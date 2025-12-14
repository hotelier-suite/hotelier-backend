import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { RolesService } from './roles.service';
import { CreatePermissionDto } from '@app/contracts/auth-service/permissions/dto/create-permission.dto';
import { PermissionIdsDto } from '@app/contracts/auth-service/roles/dto/permission-ids.dto';
import { PermissionResponseDto } from '@app/contracts/auth-service/permissions/dto/permission-response.dto';
import { UpdatePermissionDto } from '@app/contracts/auth-service/permissions/dto/update-permission.dto';
import { CreateRoleDto } from '@app/contracts/auth-service/roles/dto/create-role.dto';
import { RoleResponseDto } from '@app/contracts/auth-service/roles/dto/role-response.dto';
import { UpdateRoleDto } from '@app/contracts/auth-service/roles/dto/update-role.dto';
import { Observable } from 'rxjs';
import { AuditLog } from '../../audit/decorators/audit-log.decorator';
import { AuditResource } from '../../audit/enums/audit-resource.enum';

@ApiTags('roles')
@Controller('roles')
@AuditLog({ resource: AuditResource.ROLE })
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  // Role Management Endpoints
  @Post()
  @ApiOperation({
    summary: 'Create Role',
    description: 'Create a new role in the system.',
  })
  @ApiBody({
    description: 'Role creation data',
    type: CreateRoleDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Role created successfully',
    type: RoleResponseDto,
  })
  createRole(
    @Body() createRoleDto: CreateRoleDto,
  ): Observable<RoleResponseDto> {
    return this.rolesService.createRole(createRoleDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get All Roles',
    description: 'Retrieve all roles in the system.',
  })
  @ApiResponse({
    status: 200,
    description: 'Roles retrieved successfully',
    type: [RoleResponseDto],
  })
  getAllRoles(): Observable<RoleResponseDto[]> {
    return this.rolesService.findAllRoles();
  }

  // System Permissions Management - Must come before :id route
  @Get('permissions')
  @ApiOperation({
    summary: 'Get All Permissions',
    description: 'Retrieve all system permissions.',
  })
  @ApiResponse({
    status: 200,
    description: 'Permissions retrieved successfully',
    type: [PermissionResponseDto],
  })
  getAllPermissions(): Observable<PermissionResponseDto[]> {
    return this.rolesService.findAllPermissions();
  }

  @Get('permissions/by-resource')
  @ApiOperation({
    summary: 'Get Permissions by Resource',
    description: 'Retrieve permissions grouped by resource type.',
  })
  @ApiResponse({
    status: 200,
    description: 'Permissions by resource retrieved successfully',
    schema: {
      type: 'object',
      additionalProperties: {
        type: 'array',
        items: { $ref: '#/components/schemas/PermissionResponseDto' },
      },
    },
  })
  getPermissionsByResource(): Observable<
    Record<string, PermissionResponseDto[]>
  > {
    return this.rolesService.getPermissionsByResource();
  }

  @Get('name/:name')
  @ApiOperation({
    summary: 'Get Role by Name',
    description: 'Retrieve a specific role by its name.',
  })
  @ApiParam({
    name: 'name',
    description: 'Role name',
    type: 'string',
    example: 'admin',
  })
  @ApiResponse({
    status: 200,
    description: 'Role retrieved successfully',
    type: RoleResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Role not found',
  })
  getRoleByName(@Param('name') name: string): Observable<RoleResponseDto> {
    return this.rolesService.findRoleByName(name);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get Role by ID',
    description: 'Retrieve a specific role by its ID.',
  })
  @ApiParam({
    name: 'id',
    description: 'Role ID',
    type: 'number',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Role retrieved successfully',
    type: RoleResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Role not found',
  })
  getRoleById(
    @Param('id', ParseIntPipe) id: number,
  ): Observable<RoleResponseDto> {
    return this.rolesService.findRoleById(id);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update Role',
    description: 'Update an existing role.',
  })
  @ApiParam({
    name: 'id',
    description: 'Role ID',
    type: 'number',
    example: 1,
  })
  @ApiBody({
    description: 'Role update data',
    type: UpdateRoleDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Role updated successfully',
    type: RoleResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Role not found',
  })
  updateRole(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRoleDto: UpdateRoleDto,
  ): Observable<RoleResponseDto> {
    return this.rolesService.updateRole(id, updateRoleDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete Role',
    description: 'Delete a role from the system.',
  })
  @ApiParam({
    name: 'id',
    description: 'Role ID',
    type: 'number',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Role deleted successfully',
    type: RoleResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Role not found',
  })
  deleteRole(
    @Param('id', ParseIntPipe) id: number,
  ): Observable<RoleResponseDto> {
    return this.rolesService.deleteRole(id);
  }

  // Permission Assignment to Roles
  @Put(':id/permissions')
  @ApiOperation({
    summary: 'Assign Permissions to Role',
    description: 'Assign multiple permissions to a specific role.',
  })
  @ApiParam({
    name: 'id',
    description: 'Role ID',
    type: 'number',
    example: 1,
  })
  @ApiBody({
    description: 'Permission IDs to assign',
    type: PermissionIdsDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Permissions assigned successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Role not found',
  })
  assignPermissionsToRole(
    @Param('id', ParseIntPipe) roleId: number,
    @Body() body: PermissionIdsDto,
  ): Observable<void> {
    return this.rolesService.assignPermissionsToRole(
      roleId,
      body.permissionIds,
    );
  }

  @Delete(':roleId/permissions/:permissionId')
  @ApiOperation({
    summary: 'Remove Permission from Role',
    description: 'Remove a specific permission from a role.',
  })
  @ApiParam({
    name: 'roleId',
    description: 'Role ID',
    type: 'number',
    example: 1,
  })
  @ApiParam({
    name: 'permissionId',
    description: 'Permission ID',
    type: 'number',
    example: 1,
  })
  @ApiResponse({
    status: 204,
    description: 'Permission removed successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Role or permission not found',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  removePermissionFromRole(
    @Param('roleId', ParseIntPipe) roleId: number,
    @Param('permissionId', ParseIntPipe) permissionId: number,
  ): Observable<void> {
    return this.rolesService.removePermissionsFromRole(roleId, [permissionId]);
  }

  @Post('/permissions')
  @ApiOperation({
    summary: 'Create Permission',
    description: 'Create a new system permission.',
  })
  @ApiBody({
    description: 'Permission creation data',
    type: CreatePermissionDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Permission created successfully',
    type: PermissionResponseDto,
  })
  createPermission(
    @Body() createPermissionDto: CreatePermissionDto,
  ): Observable<PermissionResponseDto> {
    return this.rolesService.createPermission(createPermissionDto);
  }

  @Put('/permissions/:id')
  @ApiOperation({
    summary: 'Update Permission',
    description: 'Update an existing system permission.',
  })
  @ApiParam({
    name: 'id',
    description: 'Permission ID',
    type: 'number',
    example: 1,
  })
  @ApiBody({
    description: 'Permission update data',
    type: UpdatePermissionDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Permission updated successfully',
    type: PermissionResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Permission not found',
  })
  updatePermission(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePermissionDto: UpdatePermissionDto,
  ): Observable<PermissionResponseDto> {
    return this.rolesService.updatePermission(id, updatePermissionDto);
  }

  @Delete('/permissions/:id')
  @ApiOperation({
    summary: 'Delete Permission',
    description: 'Delete a system permission.',
  })
  @ApiParam({
    name: 'id',
    description: 'Permission ID',
    type: 'number',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Permission deleted successfully',
    type: PermissionResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Permission not found',
  })
  deletePermission(
    @Param('id', ParseIntPipe) id: number,
  ): Observable<PermissionResponseDto> {
    return this.rolesService.deletePermission(id);
  }
}
