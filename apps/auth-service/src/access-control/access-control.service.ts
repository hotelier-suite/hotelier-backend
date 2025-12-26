import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  PermissionResponseDto,
  RoleResponseDto,
} from '@app/contracts/auth-service';
import { User, UserRole } from '../users';

@Injectable()
export class AccessControlService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserRole)
    private readonly userRoleRepository: Repository<UserRole>,
  ) {}

  async getUserWithRoles(identifier: number | string): Promise<User | null> {
    const where =
      typeof identifier === 'number'
        ? { id: identifier }
        : { email: identifier };

    return this.userRepository.findOne({
      where,
      relations: {
        userRoles: {
          role: {
            permissions: {
              permission: true,
            },
          },
        },
      },
    });
  }

  async getUserWithRolesAndPassword(
    identifier: number | string,
  ): Promise<User | null> {
    const where =
      typeof identifier === 'number'
        ? { id: identifier }
        : { email: identifier };

    return this.userRepository.findOne({
      where,
      select: {
        id: true,
        email: true,
        password: true,
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
      },
      relations: {
        userRoles: {
          role: {
            permissions: {
              permission: true,
            },
          },
        },
      },
    });
  }

  async getUserWithRefreshToken(userId: number): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        refreshToken: true,
        isActive: true,
      },
    });
  }

  async getUserPermissions(userId: number): Promise<string[]> {
    const user = await this.getUserWithRoles(userId);

    if (!user) {
      return [];
    }

    const permissions = new Set<string>();

    for (const userRole of user.userRoles) {
      for (const rolePermission of userRole.role.permissions) {
        const perm = `${rolePermission.permission.resource}:${rolePermission.permission.action}`;
        permissions.add(perm);
      }
    }

    return Array.from(permissions);
  }

  async getUserRoles(userId: number): Promise<RoleResponseDto[]> {
    const userRoles = await this.userRoleRepository.find({
      where: { userId },
      relations: { role: { permissions: { permission: true } } },
    });

    const roles = userRoles.map((ur) => ur.role);
    return roles;
  }

  async getUserPermissionsList(
    userId: number,
  ): Promise<PermissionResponseDto[]> {
    const roles = await this.getUserRoles(userId);
    const permissions: PermissionResponseDto[] = [];

    for (const role of roles) {
      for (const rolePermission of role.permissions) {
        if (!permissions.find((p) => p.id === rolePermission.permission.id)) {
          permissions.push(rolePermission.permission);
        }
      }
    }

    return permissions;
  }
}
