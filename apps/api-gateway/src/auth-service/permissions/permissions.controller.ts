import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { PermissionsService } from './permissions.service';
import {
  CreatePermissionDto,
  PermissionResponseDto,
  UpdatePermissionDto,
  PermissionsByResourceDto,
} from '@app/contracts/auth-service';
import { AuditLog } from '../../audit-service';
import { AuditResource } from '@app/contracts/audit-service';

@ApiTags('permissions')
@Controller('roles/permissions')
@AuditLog({ resource: AuditResource.PERMISSION })
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Get()
  @ApiOperation({
    summary: 'Get All Permissions',
    description:
      'Retrieve all system permissions available for role assignment.',
  })
  @ApiResponse({
    status: 200,
    description: 'Permissions retrieved successfully',
    type: [PermissionResponseDto],
  })
  findAll(): Observable<PermissionResponseDto[]> {
    return this.permissionsService.findAll();
  }

  @Get('by-resource')
  @ApiOperation({
    summary: 'Get Permissions by Resource',
    description:
      'Retrieve all permissions grouped by resource type for easier management and assignment.',
  })
  @ApiResponse({
    status: 200,
    description: 'Permissions by resource retrieved successfully',
    type: PermissionsByResourceDto,
  })
  findByResource(): Observable<Record<string, PermissionResponseDto[]>> {
    return this.permissionsService.findByResource();
  }

  @Post()
  @ApiOperation({
    summary: 'Create Permission',
    description:
      'Create a new system permission that can be assigned to roles.',
  })
  @ApiBody({
    description:
      'Permission creation data including name, resource, and action',
    type: CreatePermissionDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Permission created successfully',
    type: PermissionResponseDto,
  })
  @ApiResponse({
    status: 400,
    description:
      'Invalid request data - validation failed or duplicate permission',
  })
  create(
    @Body() createPermissionDto: CreatePermissionDto,
  ): Observable<PermissionResponseDto> {
    return this.permissionsService.create(createPermissionDto);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update Permission',
    description:
      'Update an existing system permission. Changes will affect all roles with this permission.',
  })
  @ApiParam({
    name: 'id',
    description: 'Unique identifier of the permission to update',
    type: 'number',
    example: 1,
  })
  @ApiBody({
    description:
      'Permission update data - only include fields that need to be changed',
    type: UpdatePermissionDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Permission updated successfully',
    type: PermissionResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request data - validation failed',
  })
  @ApiResponse({
    status: 404,
    description: 'Permission not found',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePermissionDto: UpdatePermissionDto,
  ): Observable<PermissionResponseDto> {
    return this.permissionsService.update(id, updatePermissionDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete Permission',
    description:
      'Permanently delete a system permission. This will remove the permission from all roles.',
  })
  @ApiParam({
    name: 'id',
    description: 'Unique identifier of the permission to delete',
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
  remove(
    @Param('id', ParseIntPipe) id: number,
  ): Observable<PermissionResponseDto> {
    return this.permissionsService.remove(id);
  }
}
