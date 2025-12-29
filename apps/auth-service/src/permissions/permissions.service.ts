import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Like, Repository } from 'typeorm';
import {
  CreatePermissionDto,
  FindPermissionsFilterDto,
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

  create(data: CreatePermissionDto): Promise<PermissionResponseDto> {
    const entity = this.permissionRepository.create(data);
    return this.permissionRepository.save(entity);
  }

  async findAll(
    filters: FindPermissionsFilterDto,
  ): Promise<PermissionResponseDto[]> {
    const where: FindOptionsWhere<SystemPermission> = {};

    if (filters.resource) {
      where.resource = Like(`%${filters.resource}%`);
    }

    if (filters.action) {
      where.action = Like(`%${filters.action}%`);
    }

    const permissions = await this.permissionRepository.find({
      where,
      order: { resource: 'ASC', action: 'ASC' },
    });

    return permissions;
  }

  async findOne(id: number): Promise<PermissionResponseDto> {
    const permission = await this.permissionRepository.findOne({
      where: { id },
    });

    if (!permission) {
      throw new RpcException({
        statusCode: 404,
        message: 'Permission not found',
      });
    }

    return permission;
  }

  async update(
    id: number,
    data: UpdatePermissionDto,
  ): Promise<PermissionResponseDto> {
    const permission = await this.findOne(id);
    const entity = this.permissionRepository.create(permission);
    const merged = this.permissionRepository.merge(entity, data);
    return this.permissionRepository.save(merged);
  }

  async remove(id: number): Promise<PermissionResponseDto> {
    const permission = await this.findOne(id);

    const roleCount = await this.rolePermissionRepository.count({
      where: { permissionId: id },
    });

    if (roleCount > 0) {
      throw new RpcException({
        statusCode: 409,
        message: 'Cannot delete permission that is assigned to roles',
      });
    }

    const entity = this.permissionRepository.create(permission);
    return this.permissionRepository.remove(entity);
  }
}
