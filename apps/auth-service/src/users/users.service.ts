import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserResponseDto } from '@app/contracts/auth-service/users/dto/user-response.dto';
import { RoleResponseDto } from '@app/contracts/auth-service/roles/dto/role-response.dto';
import { PermissionResponseDto } from '@app/contracts/auth-service/permissions/dto/permission-response.dto';
import { User } from './entities/user.entity';
import { Role } from '../roles/entities/role.entity';
import { UserRole } from '../users/entities/user-role.entity';
import { AccessControlService } from '../access-control/access-control.service';

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

  async getDefaultRole(roleId?: number): Promise<number> {
    if (roleId) {
      return roleId;
    }

    const defaultRole = await this.roleRepository.findOne({
      where: { name: 'client' },
    });

    if (!defaultRole) {
      throw new InternalServerErrorException(
        'Default client role not found. Please run database seeds.',
      );
    }

    return defaultRole.id;
  }

  async assignSingleRoleToUser(
    userId: number,
    roleId: number,
    assignedBy = 'system',
  ): Promise<void> {
    await this.userRoleRepository.save({
      userId,
      roleId,
      assignedBy,
    });
  }

  async clearRefreshToken(userId: number): Promise<void> {
    await this.userRepository.update(userId, { refreshToken: undefined });
  }

  async updateLastLogin(userId: number): Promise<void> {
    await this.userRepository.update(userId, { lastLogin: new Date() });
  }

  private toUserResponse(user: User): UserResponseDto {
    const dto: UserResponseDto = {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      loyaltyPoints: user.loyaltyPoints,
      loyaltyLevel: user.loyaltyLevel,
      preferences: user.preferences,
      registrationDate: user.registrationDate,
      lastVisit: user.lastVisit,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      firstVisit: user.firstVisit,
      isActive: user.isActive,
      lastLogin: user.lastLogin,
      roles: user.userRoles.map((ur) => ({
        id: ur.role.id,
        name: ur.role.name,
        description: ur.role.description,
      })),
    };

    return dto;
  }

  async findAllUsers(): Promise<UserResponseDto[]> {
    const users = await this.userRepository.find({
      relations: { userRoles: { role: true } },
      order: { createdAt: 'DESC' },
    });

    return users.map((user) => this.toUserResponse(user));
  }

  async findUserById(id: number): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: { userRoles: { role: true } },
    });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return this.toUserResponse(user);
  }

  async createUser(data: Partial<User>): Promise<UserResponseDto> {
    const user = await this.userRepository.save(data);

    const loaded = await this.userRepository.findOne({
      where: { id: user.id },
      relations: { userRoles: { role: true } },
    });

    if (!loaded) {
      throw new InternalServerErrorException(
        `Failed to load user with id ${user.id} after creation`,
      );
    }

    return this.toUserResponse(loaded);
  }

  async updateUser(id: number, data: Partial<User>): Promise<UserResponseDto> {
    const existing = await this.userRepository.findOne({
      where: { id },
      relations: { userRoles: { role: true } },
    });

    if (!existing) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    await this.userRepository.update(id, data);

    const updated = await this.userRepository.findOne({
      where: { id },
      relations: { userRoles: { role: true } },
    });

    if (!updated) {
      throw new InternalServerErrorException(`User with id ${id} not found`);
    }

    return this.toUserResponse(updated);
  }

  async deleteUser(id: number): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: { userRoles: { role: true } },
    });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    await this.userRepository.remove(user);
    return this.toUserResponse(user);
  }

  async activateUser(id: number): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: { userRoles: { role: true } },
    });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    await this.userRepository.update(id, { isActive: true });

    const updated = await this.userRepository.findOne({
      where: { id },
      relations: { userRoles: { role: true } },
    });

    if (!updated) {
      throw new InternalServerErrorException(`User with id ${id} not found`);
    }

    return this.toUserResponse(updated);
  }

  async deactivateUser(id: number): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: { userRoles: { role: true } },
    });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    await this.userRepository.update(id, { isActive: false });

    const updated = await this.userRepository.findOne({
      where: { id },
      relations: { userRoles: { role: true } },
    });

    if (!updated) {
      throw new InternalServerErrorException(`User with id ${id} not found`);
    }

    return this.toUserResponse(updated);
  }

  async assignRolesToUser(userId: number, roleIds: number[]): Promise<void> {
    await this.userRoleRepository.delete({ userId });

    if (roleIds.length > 0) {
      const validRoleIds = roleIds.filter(
        (roleId) =>
          roleId != null && !isNaN(roleId) && Number.isInteger(roleId),
      );

      if (validRoleIds.length === 0) {
        throw new InternalServerErrorException('No valid role IDs provided');
      }

      const existingRoles = await this.roleRepository
        .createQueryBuilder('role')
        .where('role.id IN (:...roleIds)', { roleIds: validRoleIds })
        .getMany();

      if (existingRoles.length !== validRoleIds.length) {
        const foundRoleIds = existingRoles.map((r) => r.id);
        const missingRoleIds = validRoleIds.filter(
          (id) => !foundRoleIds.includes(id),
        );
        throw new InternalServerErrorException(
          `Roles with IDs ${missingRoleIds.join(', ')} do not exist`,
        );
      }

      const userRoles = validRoleIds.map((roleId) => ({ userId, roleId }));
      await this.userRoleRepository.save(userRoles);
    }
  }

  async removeRolesFromUser(userId: number, roleIds: number[]): Promise<void> {
    if (roleIds.length > 0) {
      await this.userRoleRepository.delete({
        userId,
        roleId: roleIds.length > 0 ? roleIds[0] : undefined,
      });
    }
  }

  async getUserRoles(userId: number): Promise<RoleResponseDto[]> {
    return this.accessControlService.getUserRoles(userId);
  }

  async getUserPermissionsList(
    userId: number,
  ): Promise<PermissionResponseDto[]> {
    return this.accessControlService.getUserPermissionsList(userId);
  }
}
