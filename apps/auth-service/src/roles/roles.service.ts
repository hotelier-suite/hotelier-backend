import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRoleDto } from '@app/contracts/auth-service/roles/dto/create-role.dto';
import { UpdateRoleDto } from '@app/contracts/auth-service/roles/dto/update-role.dto';
import { RoleResponseDto } from '@app/contracts/auth-service/roles/dto/role-response.dto';
import { Role } from './entities/role.entity';
import { RolePermission } from './entities/role-permission.entity';
import { UserRole } from '../users/entities/user-role.entity';

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

  async createRole(data: CreateRoleDto): Promise<RoleResponseDto> {
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

  async findAllRoles(): Promise<RoleResponseDto[]> {
    const roles = await this.roleRepository.find({
      relations: { permissions: { permission: true } },
      order: { name: 'ASC' },
    });

    return roles;
  }

  async findRoleById(id: number): Promise<RoleResponseDto> {
    const role = await this.roleRepository.findOne({
      where: { id },
      relations: { permissions: { permission: true } },
    });

    if (!role) {
      throw new RpcException({ statusCode: 404, message: 'Role not found' });
    }

    return role;
  }

  async findRoleByName(name: string): Promise<RoleResponseDto> {
    const role = await this.roleRepository.findOne({
      where: { name },
      relations: { permissions: { permission: true } },
    });

    if (!role) {
      throw new RpcException({ statusCode: 404, message: 'Role not found' });
    }

    return role;
  }

  async updateRole(id: number, data: UpdateRoleDto): Promise<RoleResponseDto> {
    const existing = await this.roleRepository.findOne({
      where: { id },
      relations: { permissions: { permission: true } },
    });

    if (!existing) {
      throw new RpcException({ statusCode: 404, message: 'Role not found' });
    }

    try {
      await this.roleRepository.update(id, data);
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

  async deleteRole(id: number): Promise<RoleResponseDto> {
    const role = await this.roleRepository.findOne({
      where: { id },
      relations: { permissions: { permission: true } },
    });

    if (!role) {
      throw new RpcException({ statusCode: 404, message: 'Role not found' });
    }

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

    await this.roleRepository.remove(role);
    return role;
  }

  async assignPermissionsToRole(
    roleId: number,
    permissionIds: number[],
  ): Promise<void> {
    const role = await this.roleRepository.findOne({ where: { id: roleId } });

    if (!role) {
      throw new RpcException({ statusCode: 404, message: 'Role not found' });
    }

    await this.rolePermissionRepository.delete({ roleId });

    if (permissionIds.length > 0) {
      const rolePermissions = permissionIds.map((permissionId) => ({
        roleId,
        permissionId,
      }));
      await this.rolePermissionRepository.save(rolePermissions);
    }
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
