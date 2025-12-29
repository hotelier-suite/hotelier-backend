import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import {
  FindOptionsRelations,
  FindOptionsSelect,
  FindOptionsWhere,
  Like,
  Repository,
} from 'typeorm';
import {
  UserResponseDto,
  RoleResponseDto,
  PermissionResponseDto,
  FindUsersFilterDto,
} from '@app/contracts/auth-service';
import { User } from './entities';
import { Role } from '../roles';
import { UserRole } from './entities';
import { AccessControlService } from '../access-control';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(UserRole)
    private readonly userRoleRepository: Repository<UserRole>,
    private readonly accessControlService: AccessControlService,
  ) {}

  private readonly userSelect: FindOptionsSelect<User> = {
    id: true,
    email: true,
    name: true,
    phone: true,
    loyaltyPoints: true,
    loyaltyLevel: true,
    preferences: true,
    registrationDate: true,
    lastVisit: true,
    createdAt: true,
    updatedAt: true,
    firstVisit: true,
    isActive: true,
    lastLogin: true,
    userRoles: {
      id: true,
      role: {
        id: true,
        name: true,
        description: true,
      },
    },
  };

  private readonly userRelations: FindOptionsRelations<User> = {
    userRoles: {
      role: true,
    },
  };

  async getDefaultRole(roleId?: number): Promise<number> {
    if (roleId) {
      return roleId;
    }

    const defaultRole = await this.roleRepository.findOne({
      where: { name: 'client' },
    });

    if (!defaultRole) {
      throw new RpcException({
        statusCode: 500,
        message: 'Default client role not found. Please run database seeds.',
      });
    }

    return defaultRole.id;
  }

  async assignSingleRoleToUser(
    userId: number,
    roleId: number,
    assignedBy = 'system',
  ): Promise<void> {
    const entity = this.userRoleRepository.create({
      userId,
      roleId,
      assignedBy,
    });
    await this.userRoleRepository.save(entity);
  }

  async clearRefreshToken(userId: number): Promise<void> {
    await this.userRepository.update(userId, { refreshToken: undefined });
  }

  async updateLastLogin(userId: number): Promise<void> {
    await this.userRepository.update(userId, { lastLogin: new Date() });
  }

  findAll(filters: FindUsersFilterDto): Promise<UserResponseDto[]> {
    const where: FindOptionsWhere<User> = {};

    if (filters.email) {
      where.email = Like(`%${filters.email}%`);
    }

    if (filters.isActive !== undefined) {
      where.isActive = filters.isActive;
    }

    if (filters.roleId) {
      where.userRoles = {
        roleId: filters.roleId,
      };
    }

    return this.userRepository.find({
      where,
      select: this.userSelect,
      relations: this.userRelations,
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({
      where: { id },
      select: this.userSelect,
      relations: this.userRelations,
    });

    if (!user) {
      throw new RpcException({
        statusCode: 404,
        message: `User with id ${id} not found`,
      });
    }

    return user;
  }

  async create(data: Partial<User>): Promise<UserResponseDto> {
    const entity = this.userRepository.create(data);
    const user = await this.userRepository.save(entity);

    const loaded = await this.userRepository.findOne({
      where: { id: user.id },
      select: this.userSelect,
      relations: this.userRelations,
    });

    if (!loaded) {
      throw new RpcException({
        statusCode: 500,
        message: `Failed to load user with id ${user.id} after creation`,
      });
    }

    return loaded;
  }

  async update(
    id: number,
    data: Partial<User> & { roleIds?: number[] },
  ): Promise<UserResponseDto> {
    const existing = await this.userRepository.findOne({
      where: { id },
      relations: { userRoles: { role: true } },
    });

    if (!existing) {
      throw new RpcException({
        statusCode: 404,
        message: `User with id ${id} not found`,
      });
    }

    // Extract roleIds from data and handle separately
    const { roleIds, ...userData } = data;

    // Update user data if there are any fields to update
    if (Object.keys(userData).length > 0) {
      await this.userRepository.update(id, userData);
    }

    // Handle role assignment if roleIds is provided
    if (roleIds !== undefined) {
      await this.assignRolesToUser(id, roleIds);
    }

    const updated = await this.userRepository.findOne({
      where: { id },
      select: this.userSelect,
      relations: this.userRelations,
    });

    if (!updated) {
      throw new RpcException({
        statusCode: 500,
        message: `User with id ${id} not found`,
      });
    }

    return updated;
  }

  private async assignRolesToUser(
    userId: number,
    roleIds: number[],
  ): Promise<void> {
    const incomingRoleIds = Array.isArray(roleIds) ? roleIds : [];

    const validRoleIds = incomingRoleIds.filter(
      (roleId) => roleId != null && Number.isInteger(roleId) && roleId > 0,
    );

    const uniqueRoleIds = Array.from(new Set(validRoleIds));

    if (incomingRoleIds.length > 0 && uniqueRoleIds.length === 0) {
      throw new RpcException({
        statusCode: 400,
        message: 'No valid role IDs provided',
      });
    }

    if (uniqueRoleIds.length > 0) {
      const existingRoles = await this.roleRepository
        .createQueryBuilder('role')
        .where('role.id IN (:...roleIds)', { roleIds: uniqueRoleIds })
        .getMany();

      if (existingRoles.length !== uniqueRoleIds.length) {
        const foundRoleIds = existingRoles.map((r) => r.id);
        const missingRoleIds = uniqueRoleIds.filter(
          (id) => !foundRoleIds.includes(id),
        );

        throw new RpcException({
          statusCode: 400,
          message: `Roles with IDs ${missingRoleIds.join(', ')} do not exist`,
        });
      }
    }

    await this.userRoleRepository.manager.transaction(async (manager) => {
      const userRoleRepository = manager.getRepository(UserRole);
      await userRoleRepository.delete({ userId });

      if (uniqueRoleIds.length > 0) {
        const userRoles = uniqueRoleIds.map((roleId) => ({ userId, roleId }));
        const entities = userRoleRepository.create(userRoles);
        await userRoleRepository.save(entities);
      }
    });
  }

  async remove(id: number): Promise<UserResponseDto> {
    const user = await this.findOne(id);
    const entity = this.userRepository.create(user);
    return this.userRepository.remove(entity);
  }

  async removeRolesFromUser(userId: number, roleIds: number[]): Promise<void> {
    if (roleIds.length > 0) {
      await this.userRoleRepository.delete({
        userId,
        roleId: roleIds.length > 0 ? roleIds[0] : undefined,
      });
    }
  }

  getUserRoles(userId: number): Promise<RoleResponseDto[]> {
    return this.accessControlService.getUserRoles(userId);
  }

  getUserPermissionsList(userId: number): Promise<PermissionResponseDto[]> {
    return this.accessControlService.getUserPermissionsList(userId);
  }
}
