import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository, FindOptionsWhere } from 'typeorm';
import {
  CreateRoleDto,
  UpdateRoleDto,
  RoleResponseDto,
  FindRolesFilterDto,
} from '@app/contracts/auth-service';
import { Role, RolePermission } from './entities';
import { UserRole } from '../users';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(RolePermission)
    private readonly rolePermissionRepository: Repository<RolePermission>,
    @InjectRepository(UserRole)
    private readonly userRoleRepository: Repository<UserRole>,
  ) {}

  async create(data: CreateRoleDto): Promise<RoleResponseDto> {
    try {
      const role = await this.roleRepository.save(data);

      const loaded = await this.roleRepository.findOne({
        where: { id: role.id },
        relations: { permissions: { permission: true } },
      });

      if (!loaded) {
        throw new RpcException({
          statusCode: 500,
          message: `Failed to load role with id ${role.id} after creation`,
        });
      }

      return loaded;
    } catch (e: unknown) {
      const err = e as { code?: unknown };
      if (typeof err.code === 'string' && err.code === '23505') {
        throw new RpcException({
          statusCode: 409,
          message: `Role with name '${data.name}' already exists`,
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

  findAll(filters: FindRolesFilterDto): Promise<RoleResponseDto[]> {
    const where: FindOptionsWhere<Role> = {};

    if (filters.name) {
      where.name = ILike(`%${filters.name}%`);
    }

    return this.roleRepository.find({
      where,
      relations: { permissions: { permission: true } },
      order: { name: 'ASC' },
    });
  }

  async findOne(id: number): Promise<RoleResponseDto> {
    const role = await this.roleRepository.findOne({
      where: { id },
      relations: { permissions: { permission: true } },
    });

    if (!role) {
      throw new RpcException({ statusCode: 404, message: 'Role not found' });
    }

    return role;
  }

  async update(id: number, data: UpdateRoleDto): Promise<RoleResponseDto> {
    const existing = await this.roleRepository.findOne({
      where: { id },
      relations: { permissions: { permission: true } },
    });

    if (!existing) {
      throw new RpcException({ statusCode: 404, message: 'Role not found' });
    }

    try {
      // Update basic role fields (name, description)
      const { permissionIds, ...roleData } = data;
      if (Object.keys(roleData).length > 0) {
        await this.roleRepository.update(id, roleData);
      }

      // Handle permission assignment if permissionIds is provided
      if (permissionIds !== undefined) {
        // Delete existing permissions
        await this.rolePermissionRepository.delete({ roleId: id });

        // Add new permissions
        if (permissionIds.length > 0) {
          const rolePermissions = permissionIds.map((permissionId) => ({
            roleId: id,
            permissionId,
          }));
          await this.rolePermissionRepository.save(rolePermissions);
        }
      }

      const updated = await this.roleRepository.findOne({
        where: { id },
        relations: { permissions: { permission: true } },
      });

      if (!updated) {
        throw new RpcException({ statusCode: 404, message: 'Role not found' });
      }

      return updated;
    } catch (e: unknown) {
      const err = e as { code?: unknown };
      if (typeof err.code === 'string' && err.code === '23505') {
        throw new RpcException({
          statusCode: 409,
          message: `Role with name '${data.name}' already exists`,
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

  async remove(id: number): Promise<RoleResponseDto> {
    const role = await this.findOne(id);

    if (role.isSystem) {
      throw new RpcException({
        statusCode: 409,
        message: 'Cannot delete system role',
      });
    }

    const userCount = await this.userRoleRepository.count({
      where: { roleId: id },
    });

    if (userCount > 0) {
      throw new RpcException({
        statusCode: 409,
        message: 'Cannot delete role that is assigned to users',
      });
    }

    const entity = this.roleRepository.create(role);
    return this.roleRepository.remove(entity);
  }

  async removePermissionsFromRole(
    roleId: number,
    permissionIds: number[],
  ): Promise<void> {
    await this.rolePermissionRepository.delete({
      roleId,
      permissionId: permissionIds.length > 0 ? permissionIds[0] : undefined,
    });
  }
}
