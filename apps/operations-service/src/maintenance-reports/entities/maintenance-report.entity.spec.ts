import { MaintenanceReport } from './';
import {
  HousekeepingMaintenanceType,
  HousekeepingMaintenanceStatus,
} from '@app/contracts/operations-service';
import { TaskPriority } from '@app/contracts/common';

describe('MaintenanceReport Entity', () => {
  it('should create an instance', () => {
    const entity = new MaintenanceReport();
    expect(entity).toBeDefined();
  });

  it('should accept all properties', () => {
    const entity = new MaintenanceReport();
    entity.id = 1;
    entity.reportNumber = 'MR-001';
    entity.type = HousekeepingMaintenanceType.PLUMBING;
    entity.description = 'Leaky faucet';
    entity.priority = TaskPriority.HIGH;
    entity.status = HousekeepingMaintenanceStatus.PENDING;
    entity.assignedTechnician = 'Luis';
    entity.reportedBy = 'Maria';
    entity.estimatedTime = '2 hours';
    entity.startedAt = new Date(2024, 5, 15, 9, 0);
    entity.completedAt = new Date(2024, 5, 15, 11, 0);
    entity.cost = 150.5;
    entity.notes = 'Fixed';
    entity.roomId = 1;
    entity.createdAt = new Date(2024, 5, 15);
    entity.updatedAt = new Date(2024, 5, 15);

    expect(entity.id).toBe(1);
    expect(entity.reportNumber).toBe('MR-001');
    expect(entity.type).toBe(HousekeepingMaintenanceType.PLUMBING);
    expect(entity.cost).toBe(150.5);
  });

  it('should generate report number via BeforeInsert hook', () => {
    const entity = new MaintenanceReport();
    entity.generateReportNumber();
    expect(entity.reportNumber).toMatch(/^MR-\d+$/);
  });

  it('should not overwrite existing report number', () => {
    const entity = new MaintenanceReport();
    entity.reportNumber = 'MR-EXISTING';
    entity.generateReportNumber();
    expect(entity.reportNumber).toBe('MR-EXISTING');
  });

  it('should allow optional fields to be undefined', () => {
    const entity = new MaintenanceReport();
    entity.id = 1;
    entity.reportNumber = 'MR-001';
    entity.type = HousekeepingMaintenanceType.ELECTRICAL;
    entity.description = 'Test';
    entity.reportedBy = 'Test';

    expect(entity.assignedTechnician).toBeUndefined();
    expect(entity.estimatedTime).toBeUndefined();
    expect(entity.startedAt).toBeUndefined();
    expect(entity.completedAt).toBeUndefined();
    expect(entity.cost).toBeUndefined();
    expect(entity.notes).toBeUndefined();
    expect(entity.roomId).toBeUndefined();
  });
});
