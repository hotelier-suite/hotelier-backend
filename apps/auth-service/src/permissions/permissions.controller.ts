import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PermissionsService } from './permissions.service';
import {
  PERMISSIONS_PATTERNS,
  CreatePermissionDto,
  PermissionResponseDto,
  UpdatePermissionDto,
} from '@app/contracts/auth-service';

@Controller()
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @MessagePattern(PERMISSIONS_PATTERNS.CREATE)
  create(@Payload() dto: CreatePermissionDto): Promise<PermissionResponseDto> {
    return this.permissionsService.create(dto);
  }

  @MessagePattern(PERMISSIONS_PATTERNS.FIND_ALL)
  findAll(): Promise<PermissionResponseDto[]> {
    return this.permissionsService.findAll();
  }

  @MessagePattern(PERMISSIONS_PATTERNS.BY_RESOURCE)
  getPermissionsByResource(): Promise<Record<string, PermissionResponseDto[]>> {
    return this.permissionsService.getPermissionsByResource();
  }

  @MessagePattern(PERMISSIONS_PATTERNS.UPDATE)
  update(
    @Payload() payload: { id: number; data: UpdatePermissionDto },
  ): Promise<PermissionResponseDto> {
    return this.permissionsService.update(payload.id, payload.data);
  }

  @MessagePattern(PERMISSIONS_PATTERNS.DELETE)
  remove(@Payload() id: number): Promise<PermissionResponseDto> {
    return this.permissionsService.remove(id);
  }
}
