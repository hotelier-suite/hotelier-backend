import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreatePermissionDto,
  PermissionResponseDto,
  UpdatePermissionDto,
} from '@app/contracts/auth-service';
import { SystemPermission } from './entities';
import { RolePermission } from '../roles';

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
        throw new RpcException({
          statusCode: 409,
          message: `Permission for resource '${data.resource}' and action '${data.action}' already exists`,
        });
      }

      if (e instanceof RpcException) {
        throw e;
      }

      throw new RpcException({
        statusCode: 500,
        message: 'Internal server error',
      });
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
      throw new RpcException({
        statusCode: 404,
        message: 'Permission not found',
      });
    }

    try {
      await this.permissionRepository.update(id, data);
      const updated = await this.permissionRepository.findOne({
        where: { id },
      });

      if (!updated) {
        throw new RpcException({
          statusCode: 404,
          message: `Permission with id ${id} not found`,
        });
      }

      return updated;
    } catch (e: unknown) {
      const err = e as { code?: unknown };
      if (typeof err.code === 'string' && err.code === '23505') {
        throw new RpcException({
          statusCode: 409,
          message: `Permission for resource '${data.resource}' and action '${data.action}' already exists`,
        });
      }

      if (e instanceof RpcException) {
        throw e;
      }

      throw new RpcException({
        statusCode: 500,
        message: 'Internal server error',
      });
    }
  }

  async deletePermission(id: number): Promise<PermissionResponseDto> {
    const permission = await this.permissionRepository.findOne({
      where: { id },
    });

    if (!permission) {
      throw new RpcException({
        statusCode: 404,
        message: 'Permission not found',
      });
    }

    const roleCount = await this.rolePermissionRepository.count({
      where: { permissionId: id },
    });

    if (roleCount > 0) {
      throw new RpcException({
        statusCode: 409,
        message: 'Cannot delete permission that is assigned to roles',
      });
    }

    await this.permissionRepository.remove(permission);
    return permission;
  }
}
