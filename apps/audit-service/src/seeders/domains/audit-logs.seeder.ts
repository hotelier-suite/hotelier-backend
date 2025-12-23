import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from '../../audit/entities/audit-log.entity';
import { AuditAction, AuditResource } from '@app/contracts/audit-service/enums';

@Injectable()
export class AuditLogsSeeder {
  constructor(
    @InjectRepository(AuditLog)
    private readonly auditLogRepository: Repository<AuditLog>,
  ) {}

  async seed(): Promise<void> {
    const count = await this.auditLogRepository.count();
    if (count > 0) {
      console.log('  ⏭️  Audit logs already seeded, skipping...');
      return;
    }

    console.log('  🌱 Seeding audit logs...');

    const auditLogs = [
      {
        userId: 1,
        action: AuditAction.LOGIN,
        resource: AuditResource.USER,
        resourceId: '1',
        description: 'User logged in successfully',
        details: { ipAddress: '192.168.1.1' },
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      },
      {
        userId: 1,
        action: AuditAction.CREATE,
        resource: AuditResource.RESERVATION,
        resourceId: '101',
        description: 'Created new reservation',
        details: { guestName: 'John Doe', roomNumber: '201' },
      },
      {
        userId: 2,
        action: AuditAction.UPDATE,
        resource: AuditResource.ROOM,
        resourceId: '201',
        description: 'Updated room status',
        details: { oldStatus: 'available', newStatus: 'occupied' },
      },
      {
        userId: 1,
        action: AuditAction.CHECK_IN,
        resource: AuditResource.RESERVATION,
        resourceId: '101',
        description: 'Guest checked in',
        details: { guestName: 'John Doe' },
      },
      {
        userId: 3,
        action: AuditAction.CREATE,
        resource: AuditResource.INVOICE,
        resourceId: '501',
        description: 'Invoice generated',
        details: { amount: 250.0, currency: 'USD' },
      },
      {
        userId: 2,
        action: AuditAction.PAYMENT_PROCESSED,
        resource: AuditResource.PAYMENT,
        resourceId: '301',
        description: 'Payment processed successfully',
        details: { amount: 250.0, method: 'CREDIT_CARD' },
      },
      {
        userId: 1,
        action: AuditAction.CHECK_OUT,
        resource: AuditResource.RESERVATION,
        resourceId: '101',
        description: 'Guest checked out',
        details: { guestName: 'John Doe' },
      },
      {
        userId: 4,
        action: AuditAction.CREATE,
        resource: AuditResource.HOUSEKEEPING,
        resourceId: '401',
        description: 'Housekeeping task created',
        details: { roomNumber: '201', taskType: 'deep_clean' },
      },
      {
        userId: 1,
        action: AuditAction.LOGOUT,
        resource: AuditResource.USER,
        resourceId: '1',
        description: 'User logged out',
      },
      {
        userId: 5,
        action: AuditAction.SYSTEM_CONFIG_CHANGE,
        resource: AuditResource.CONFIGURATION,
        resourceId: '1',
        description: 'System configuration updated',
        details: { setting: 'check_in_time', oldValue: '14:00', newValue: '15:00' },
      },
    ];

    for (const logData of auditLogs) {
      const auditLog = this.auditLogRepository.create(logData);
      await this.auditLogRepository.save(auditLog);
    }

    console.log(`  ✅ Seeded ${auditLogs.length} audit logs`);
  }
}
