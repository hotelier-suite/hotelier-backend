import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
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
import {
  CreateRoleDto,
  RoleResponseDto,
  UpdateRoleDto,
  FindRolesFilterDto,
} from '@app/contracts/auth-service';
import { Observable } from 'rxjs';
import { AuditLog } from '../../audit-service';
import { AuditResource } from '@app/contracts/audit-service';

@ApiTags('roles')
@Controller('roles')
@AuditLog({ resource: AuditResource.ROLE })
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @ApiOperation({
    summary: 'Create Role',
    description:
      'Create a new role in the system with the specified name and description.',
  })
  @ApiBody({
    description: 'Role creation data including name and optional description',
    type: CreateRoleDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Role created successfully',
    type: RoleResponseDto,
  })
  @ApiResponse({
    status: 400,
    description:
      'Invalid request data - validation failed or duplicate role name',
  })
  create(@Body() createRoleDto: CreateRoleDto): Observable<RoleResponseDto> {
    return this.rolesService.create(createRoleDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get All Roles',
    description:
      'Retrieve all roles in the system with their associated permissions. Optionally filter by name.',
  })
  @ApiResponse({
    status: 200,
    description: 'Roles retrieved successfully',
    type: [RoleResponseDto],
  })
  findAll(@Query() filters: FindRolesFilterDto): Observable<RoleResponseDto[]> {
    return this.rolesService.findAll(filters);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get Role by ID',
    description:
      'Retrieve a specific role by its unique identifier with associated permissions.',
  })
  @ApiParam({
    name: 'id',
    description: 'Unique identifier of the role',
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

  @Patch(':id')
  @ApiOperation({
    summary: 'Update Role',
    description:
      'Update an existing role with the provided data. Only provided fields will be updated.',
  })
  @ApiParam({
    name: 'id',
    description: 'Unique identifier of the role to update',
    type: 'number',
    example: 1,
  })
  @ApiBody({
    description:
      'Role update data - only include fields that need to be changed',
    type: UpdateRoleDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Role updated successfully',
    type: RoleResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request data - validation failed',
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
    description:
      'Permanently delete a role from the system. Users with this role will lose associated permissions.',
  })
  @ApiParam({
    name: 'id',
    description: 'Unique identifier of the role to delete',
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

  @Delete(':roleId/permissions/:permissionId')
  @ApiOperation({
    summary: 'Remove Permission from Role',
    description:
      'Remove a specific permission from a role. Users with this role will lose this permission.',
  })
  @ApiParam({
    name: 'roleId',
    description: 'Unique identifier of the role',
    type: 'number',
    example: 1,
  })
  @ApiParam({
    name: 'permissionId',
    description: 'Unique identifier of the permission to remove',
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
  removePermissions(
    @Param('roleId', ParseIntPipe) roleId: number,
    @Param('permissionId', ParseIntPipe) permissionId: number,
  ): Observable<void> {
    return this.rolesService.removePermissions(roleId, [permissionId]);
  }
}
