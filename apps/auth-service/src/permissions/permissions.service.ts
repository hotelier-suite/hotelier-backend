import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePermissionDto } from '@app/contracts/auth-service/permissions/dto/create-permission.dto';
import { PermissionResponseDto } from '@app/contracts/auth-service/permissions/dto/permission-response.dto';
import { UpdatePermissionDto } from '@app/contracts/auth-service/permissions/dto/update-permission.dto';
import { SystemPermission } from './entities/system-permission.entity';
import { RolePermission } from '../roles/entities/role-permission.entity';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(SystemPermission)
    private readonly permissionRepository: Repository<SystemPermission>,
    @InjectRepository(RolePermission)
    private readonly rolePermissionRepository: Repository<RolePermission>,
  ) {}

  async createPermission(
    data: CreatePermissionDto,
  ): Promise<PermissionResponseDto> {
    try {
      const permission = await this.permissionRepository.save(data);
      return permission;
    } catch (e: unknown) {
      const err = e as { code?: unknown };
      if (typeof err.code === 'string' && err.code === '23505') {
        throw new InternalServerErrorException(
          `Permission for resource '${data.resource}' and action '${data.action}' already exists`,
        );
      }
      throw e;
    }
  }

  async findAllPermissions(): Promise<PermissionResponseDto[]> {
    const permissions = await this.permissionRepository.find({
      order: { resource: 'ASC', action: 'ASC' },
    });

    return permissions;
  }

  async getPermissionsByResource(): Promise<
    Record<string, PermissionResponseDto[]>
  > {
    const permissions = await this.findAllPermissions();
    const grouped: Record<string, PermissionResponseDto[]> = {};

    for (const permission of permissions) {
      if (!grouped[permission.resource]) {
        grouped[permission.resource] = [];
      }
      grouped[permission.resource].push(permission);
    }

    return grouped;
  }

  async updatePermission(
    id: number,
    data: UpdatePermissionDto,
  ): Promise<PermissionResponseDto> {
    const permission = await this.permissionRepository.findOne({
      where: { id },
    });

    if (!permission) {
      throw new InternalServerErrorException('Permission not found');
    }

    try {
      await this.permissionRepository.update(id, data);
      const updated = await this.permissionRepository.findOne({
        where: { id },
      });

      if (!updated) {
        throw new InternalServerErrorException(
          `Permission with id ${id} not found`,
        );
      }

      return updated;
    } catch (e: unknown) {
      const err = e as { code?: unknown };
      if (typeof err.code === 'string' && err.code === '23505') {
        throw new InternalServerErrorException(
          `Permission for resource '${data.resource}' and action '${data.action}' already exists`,
        );
      }
      throw e;
    }
  }

  async deletePermission(id: number): Promise<PermissionResponseDto> {
    const permission = await this.permissionRepository.findOne({
      where: { id },
    });

    if (!permission) {
      throw new InternalServerErrorException('Permission not found');
    }

    const roleCount = await this.rolePermissionRepository.count({
      where: { permissionId: id },
    });

    if (roleCount > 0) {
      throw new InternalServerErrorException(
        'Cannot delete permission that is assigned to roles',
      );
    }

    await this.permissionRepository.remove(permission);
    return permission;
  }
}
