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
import { PermissionIdsDto } from '@app/contracts/auth-service/roles/dto/permission-ids.dto';
import { CreateRoleDto } from '@app/contracts/auth-service/roles/dto/create-role.dto';
import { RoleResponseDto } from '@app/contracts/auth-service/roles/dto/role-response.dto';
import { UpdateRoleDto } from '@app/contracts/auth-service/roles/dto/update-role.dto';
import { Observable } from 'rxjs';
import { AuditLog } from '../../audit-service/audit/decorators/audit-log.decorator';
import { AuditResource } from '@app/contracts/audit-service/enums';

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
  create(@Body() createRoleDto: CreateRoleDto): Observable<RoleResponseDto> {
    return this.rolesService.create(createRoleDto);
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
  findAll(): Observable<RoleResponseDto[]> {
    return this.rolesService.findAll();
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
  findByName(@Param('name') name: string): Observable<RoleResponseDto> {
    return this.rolesService.findByName(name);
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
  findOne(@Param('id', ParseIntPipe) id: number): Observable<RoleResponseDto> {
    return this.rolesService.findOne(id);
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
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRoleDto: UpdateRoleDto,
  ): Observable<RoleResponseDto> {
    return this.rolesService.update(id, updateRoleDto);
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
  remove(@Param('id', ParseIntPipe) id: number): Observable<RoleResponseDto> {
    return this.rolesService.remove(id);
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
    return this.rolesService.assignPermissions(roleId, body.permissionIds);
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
    return this.rolesService.removePermissions(roleId, [permissionId]);
  }
}
