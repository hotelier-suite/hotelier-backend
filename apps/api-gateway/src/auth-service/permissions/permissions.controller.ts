import {
  Controller,
  Get,
  Post,
  Put,
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
} from '@app/contracts/auth-service';
import { AuditLog } from '../../audit-service';
import { AuditResource } from '@app/contracts/audit-service';

@ApiTags('roles')
@Controller('roles')
@AuditLog({ resource: AuditResource.PERMISSION })
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

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
    return this.permissionsService.findAll();
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
    return this.permissionsService.findByResource();
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
    return this.permissionsService.create(createPermissionDto);
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
    return this.permissionsService.update(id, updatePermissionDto);
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
    return this.permissionsService.remove(id);
  }
}
