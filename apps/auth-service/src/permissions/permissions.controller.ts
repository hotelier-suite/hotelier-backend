import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PERMISSIONS_PATTERNS } from '@app/contracts/auth-service/permissions/permissions.patterns';
import { CreatePermissionDto } from '@app/contracts/auth-service/permissions/dto/create-permission.dto';
import { PermissionResponseDto } from '@app/contracts/auth-service/permissions/dto/permission-response.dto';
import { UpdatePermissionDto } from '@app/contracts/auth-service/permissions/dto/update-permission.dto';
import { PermissionsService } from './permissions.service';

@Controller()
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @MessagePattern(PERMISSIONS_PATTERNS.CREATE)
  createPermission(
    @Payload() dto: CreatePermissionDto,
  ): Promise<PermissionResponseDto> {
    return this.permissionsService.createPermission(dto);
  }

  @MessagePattern(PERMISSIONS_PATTERNS.FIND_ALL)
  findAllPermissions(): Promise<PermissionResponseDto[]> {
    return this.permissionsService.findAllPermissions();
  }

  @MessagePattern(PERMISSIONS_PATTERNS.BY_RESOURCE)
  getPermissionsByResource(): Promise<Record<string, PermissionResponseDto[]>> {
    return this.permissionsService.getPermissionsByResource();
  }

  @MessagePattern(PERMISSIONS_PATTERNS.UPDATE)
  updatePermission(
    @Payload() payload: { id: number; data: UpdatePermissionDto },
  ): Promise<PermissionResponseDto> {
    return this.permissionsService.updatePermission(payload.id, payload.data);
  }

  @MessagePattern(PERMISSIONS_PATTERNS.DELETE)
  deletePermission(@Payload() id: number): Promise<PermissionResponseDto> {
    return this.permissionsService.deletePermission(id);
  }
}
