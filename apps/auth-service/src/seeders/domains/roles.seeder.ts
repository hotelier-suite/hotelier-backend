import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role, RolePermission } from '../../roles';
import { SystemPermission } from '../../permissions';

@Injectable()
export class RolesSeeder {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(SystemPermission)
    private permissionRepository: Repository<SystemPermission>,
    @InjectRepository(RolePermission)
    private rolePermissionRepository: Repository<RolePermission>,
  ) {}

  async seed() {
    const roles = [
      {
        name: 'administrator',
        description: 'System Administrator - Full access',
        isSystem: true,
        permissions: [
          'users:create',
          'users:read',
          'users:update',
          'users:delete',
          'users:manage_roles',
          'roles:create',
          'roles:read',
          'roles:update',
          'roles:delete',
          'reservations:create',
          'reservations:read',
          'reservations:update',
          'reservations:delete',
          'reservations:check_in',
          'reservations:check_out',
          'rooms:create',
          'rooms:read',
          'rooms:update',
          'rooms:delete',
          'billing:create',
          'billing:read',
          'billing:update',
          'billing:delete',
          'dashboard:read',
          'reports:read',
          'reports:create',
          'housekeeping:create',
          'housekeeping:read',
          'housekeeping:update',
          'housekeeping:delete',
          'restaurant:create',
          'restaurant:read',
          'restaurant:update',
          'restaurant:delete',
          'inventory:create',
          'inventory:read',
          'inventory:update',
          'inventory:delete',
          'employees:create',
          'employees:read',
          'employees:update',
          'employees:delete',
          'parking:create',
          'parking:read',
          'parking:update',
          'parking:delete',
          'events:create',
          'events:read',
          'events:update',
          'events:delete',
          'recreational:create',
          'recreational:read',
          'recreational:update',
          'recreational:delete',
          'maintenance:create',
          'maintenance:read',
          'maintenance:update',
          'maintenance:delete',
          'configuration:create',
          'configuration:read',
          'configuration:update',
          'configuration:delete',
        ],
      },
      {
        name: 'manager',
        description: 'Hotel Manager - Operational access',
        isSystem: true,
        permissions: [
          'users:read',
          'users:update',
          'reservations:create',
          'reservations:read',
          'reservations:update',
          'reservations:check_in',
          'reservations:check_out',
          'rooms:create',
          'rooms:read',
          'rooms:update',
          'billing:create',
          'billing:read',
          'billing:update',
          'dashboard:read',
          'reports:read',
          'reports:create',
          'housekeeping:read',
          'housekeeping:update',
          'restaurant:read',
          'restaurant:update',
          'inventory:read',
          'inventory:update',
          'employees:read',
          'employees:update',
          'parking:read',
          'parking:update',
          'events:create',
          'events:read',
          'events:update',
          'recreational:create',
          'recreational:read',
          'recreational:update',
          'maintenance:read',
          'maintenance:update',
          'configuration:read',
        ],
      },
      {
        name: 'receptionist',
        description: 'Receptionist - Front desk staff',
        isSystem: true,
        permissions: [
          'reservations:create',
          'reservations:read',
          'reservations:update',
          'reservations:check_in',
          'reservations:check_out',
          'rooms:read',
          'rooms:update',
          'billing:create',
          'billing:read',
          'billing:update',
          'dashboard:read',
          'parking:create',
          'parking:read',
          'parking:update',
          'events:read',
          'recreational:create',
          'recreational:read',
          'recreational:update',
        ],
      },
      {
        name: 'client',
        description: 'Hotel Client - Access to create reservations and orders',
        isSystem: true,
        permissions: [
          'reservations:create',
          'reservations:read',
          'reservations:update',
          'rooms:read',
          'restaurant:create',
          'restaurant:read',
          'events:create',
          'events:read',
          'recreational:create',
          'recreational:read',
          'parking:create',
          'parking:read',
          'parking:update',
          'users:read',
          'users:update',
        ],
      },
      {
        name: 'housekeeping_staff',
        description: 'Housekeeping Staff - Housekeeping management',
        isSystem: true,
        permissions: [
          'housekeeping:create',
          'housekeeping:read',
          'housekeeping:update',
          'rooms:read',
          'rooms:update',
          'inventory:read',
          'inventory:update',
          'dashboard:read',
        ],
      },
      {
        name: 'maintenance',
        description: 'Maintenance Staff - Maintenance management',
        isSystem: true,
        permissions: [
          'maintenance:create',
          'maintenance:read',
          'maintenance:update',
          'rooms:read',
          'rooms:update',
          'inventory:read',
          'inventory:update',
          'dashboard:read',
        ],
      },
      {
        name: 'restaurant_staff',
        description: 'Restaurant Staff - Restaurant management',
        isSystem: true,
        permissions: [
          'restaurant:create',
          'restaurant:read',
          'restaurant:update',
          'restaurant:delete',
          'inventory:read',
          'inventory:update',
          'billing:create',
          'billing:read',
          'dashboard:read',
          'events:read',
          'events:update',
          'recreational:read',
        ],
      },
    ];

    for (const roleData of roles) {
      let role = await this.roleRepository.findOne({
        where: { name: roleData.name },
      });

      if (!role) {
        role = await this.roleRepository.save({
          name: roleData.name,
          description: roleData.description,
          isSystem: roleData.isSystem,
        });
      }

      await this.assignPermissionsToRole(role, roleData.permissions);
    }
  }

  private async assignPermissionsToRole(
    role: Role,
    permissionStrings: string[],
  ) {
    for (const permissionString of permissionStrings) {
      const [resource, action] = permissionString.split(':');
      const permission = await this.permissionRepository.findOne({
        where: { resource, action },
      });

      if (permission) {
        const exists = await this.rolePermissionRepository.findOne({
          where: { roleId: role.id, permissionId: permission.id },
        });

        if (!exists) {
          await this.rolePermissionRepository.save({
            roleId: role.id,
            permissionId: permission.id,
          });
        }
      }
    }
  }
}
