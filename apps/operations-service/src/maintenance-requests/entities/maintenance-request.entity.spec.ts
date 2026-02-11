import { MaintenanceRequest } from './';
import {
  HousekeepingMaintenanceType,
  HousekeepingMaintenanceStatus,
} from '@app/contracts/operations-service';
import { TaskPriority } from '@app/contracts/common';

describe('MaintenanceRequest Entity', () => {
  it('should create an instance', () => {
    const entity = new MaintenanceRequest();
    expect(entity).toBeDefined();
  });

  it('should accept all properties', () => {
    const entity = new MaintenanceRequest();
    entity.id = 1;
    entity.roomNumber = '101';
    entity.type = HousekeepingMaintenanceType.PLUMBING;
    entity.description = 'Toilet running';
    entity.priority = TaskPriority.HIGH;
    entity.status = HousekeepingMaintenanceStatus.PENDING;
    entity.reportedBy = 'Guest';
    entity.assignedTo = 'Luis Fernandez';
    entity.reportDate = new Date(2024, 5, 15);
    entity.resolvedDate = new Date(2024, 5, 16);
    entity.cost = 75.5;
    entity.notes = 'Fixed';
    entity.roomId = 1;
    entity.createdAt = new Date(2024, 5, 15);
    entity.updatedAt = new Date(2024, 5, 15);

    expect(entity.id).toBe(1);
    expect(entity.roomNumber).toBe('101');
    expect(entity.type).toBe(HousekeepingMaintenanceType.PLUMBING);
    expect(entity.reportedBy).toBe('Guest');
    expect(entity.cost).toBe(75.5);
  });

  it('should allow optional fields to be undefined', () => {
    const entity = new MaintenanceRequest();
    entity.id = 1;
    entity.roomNumber = '101';
    entity.type = HousekeepingMaintenanceType.ELECTRICAL;
    entity.description = 'Test';
    entity.reportedBy = 'Test';
    entity.roomId = 1;

    expect(entity.assignedTo).toBeUndefined();
    expect(entity.resolvedDate).toBeUndefined();
    expect(entity.cost).toBeUndefined();
    expect(entity.notes).toBeUndefined();
  });
});
