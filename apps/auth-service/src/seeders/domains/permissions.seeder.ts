import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SystemPermission } from '../../permissions/entities/system-permission.entity';

@Injectable()
export class PermissionsSeeder {
  constructor(
    @InjectRepository(SystemPermission)
    private permissionRepository: Repository<SystemPermission>,
  ) {}

  async seed() {
    const permissions = [
      // User management
      { resource: 'users', action: 'create', description: 'Create users' },
      { resource: 'users', action: 'read', description: 'View users' },
      { resource: 'users', action: 'update', description: 'Update users' },
      { resource: 'users', action: 'delete', description: 'Delete users' },

      // Role management
      { resource: 'roles', action: 'create', description: 'Create roles' },
      { resource: 'roles', action: 'read', description: 'View roles' },
      { resource: 'roles', action: 'update', description: 'Update roles' },
      { resource: 'roles', action: 'delete', description: 'Delete roles' },

      // Reservation management
      {
        resource: 'reservations',
        action: 'create',
        description: 'Create reservations',
      },
      {
        resource: 'reservations',
        action: 'read',
        description: 'View reservations',
      },
      {
        resource: 'reservations',
        action: 'update',
        description: 'Update reservations',
      },
      {
        resource: 'reservations',
        action: 'delete',
        description: 'Delete reservations',
      },

      // Room management
      { resource: 'rooms', action: 'create', description: 'Create rooms' },
      { resource: 'rooms', action: 'read', description: 'View rooms' },
      { resource: 'rooms', action: 'update', description: 'Update rooms' },
      { resource: 'rooms', action: 'delete', description: 'Delete rooms' },

      // Billing management
      { resource: 'billing', action: 'create', description: 'Create invoices' },
      { resource: 'billing', action: 'read', description: 'View billing' },
      { resource: 'billing', action: 'update', description: 'Update billing' },
      {
        resource: 'billing',
        action: 'delete',
        description: 'Delete billing records',
      },

      // Dashboard access
      { resource: 'dashboard', action: 'read', description: 'View dashboard' },

      // Reports access
      { resource: 'reports', action: 'read', description: 'View reports' },
      {
        resource: 'reports',
        action: 'create',
        description: 'Generate reports',
      },

      // Housekeeping management
      {
        resource: 'housekeeping',
        action: 'create',
        description: 'Create cleaning tasks',
      },
      {
        resource: 'housekeeping',
        action: 'read',
        description: 'View housekeeping',
      },
      {
        resource: 'housekeeping',
        action: 'update',
        description: 'Update cleaning tasks',
      },
      {
        resource: 'housekeeping',
        action: 'delete',
        description: 'Delete cleaning tasks',
      },

      // Restaurant management
      {
        resource: 'restaurant',
        action: 'create',
        description: 'Create restaurant items',
      },
      {
        resource: 'restaurant',
        action: 'read',
        description: 'View restaurant',
      },
      {
        resource: 'restaurant',
        action: 'update',
        description: 'Update restaurant items',
      },
      {
        resource: 'restaurant',
        action: 'delete',
        description: 'Delete restaurant items',
      },

      // Inventory management
      {
        resource: 'inventory',
        action: 'create',
        description: 'Create inventory items',
      },
      { resource: 'inventory', action: 'read', description: 'View inventory' },
      {
        resource: 'inventory',
        action: 'update',
        description: 'Update inventory',
      },
      {
        resource: 'inventory',
        action: 'delete',
        description: 'Delete inventory items',
      },

      // Employee management
      {
        resource: 'employees',
        action: 'create',
        description: 'Create employees',
      },
      { resource: 'employees', action: 'read', description: 'View employees' },
      {
        resource: 'employees',
        action: 'update',
        description: 'Update employees',
      },
      {
        resource: 'employees',
        action: 'delete',
        description: 'Delete employees',
      },

      // Parking management
      {
        resource: 'parking',
        action: 'create',
        description: 'Create parking records',
      },
      { resource: 'parking', action: 'read', description: 'View parking' },
      {
        resource: 'parking',
        action: 'update',
        description: 'Update parking records',
      },
      {
        resource: 'parking',
        action: 'delete',
        description: 'Delete parking records',
      },

      // Events management
      { resource: 'events', action: 'create', description: 'Create events' },
      { resource: 'events', action: 'read', description: 'View events' },
      { resource: 'events', action: 'update', description: 'Update events' },
      { resource: 'events', action: 'delete', description: 'Delete events' },

      // Recreational management
      {
        resource: 'recreational',
        action: 'create',
        description: 'Create recreational bookings and facilities',
      },
      {
        resource: 'recreational',
        action: 'read',
        description: 'View recreational facilities and bookings',
      },
      {
        resource: 'recreational',
        action: 'update',
        description: 'Update recreational bookings and facilities',
      },
      {
        resource: 'recreational',
        action: 'delete',
        description: 'Delete recreational bookings and facilities',
      },

      // Maintenance management
      {
        resource: 'maintenance',
        action: 'create',
        description: 'Create maintenance requests',
      },
      {
        resource: 'maintenance',
        action: 'read',
        description: 'View maintenance requests',
      },
      {
        resource: 'maintenance',
        action: 'update',
        description: 'Update maintenance requests',
      },
      {
        resource: 'maintenance',
        action: 'delete',
        description: 'Delete maintenance requests',
      },

      // Configuration management
      {
        resource: 'configuration',
        action: 'create',
        description: 'Create configurations',
      },
      {
        resource: 'configuration',
        action: 'read',
        description: 'View configuration',
      },
      {
        resource: 'configuration',
        action: 'update',
        description: 'Update configurations',
      },
      {
        resource: 'configuration',
        action: 'delete',
        description: 'Delete configurations',
      },

      // User role management
      {
        resource: 'users',
        action: 'manage_roles',
        description: 'Manage user roles',
      },
    ];

    for (const permission of permissions) {
      const exists = await this.permissionRepository.findOne({
        where: { resource: permission.resource, action: permission.action },
      });

      if (!exists) {
        await this.permissionRepository.save(permission);
      }
    }
  }
}
