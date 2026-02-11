import { GeneralMaintenanceRequest } from './';
import {
  MaintenanceType,
  MaintenancePriority,
  MaintenanceStatus,
} from '@app/contracts/operations-service';

describe('GeneralMaintenanceRequest Entity', () => {
  it('should create an instance', () => {
    const entity = new GeneralMaintenanceRequest();
    expect(entity).toBeDefined();
  });

  it('should accept all properties', () => {
    const entity = new GeneralMaintenanceRequest();
    entity.id = 1;
    entity.title = 'Fix AC';
    entity.description = 'AC not working';
    entity.type = MaintenanceType.CORRECTIVE;
    entity.priority = MaintenancePriority.HIGH;
    entity.status = MaintenanceStatus.SCHEDULED;
    entity.location = 'Room 205';
    entity.equipment = 'AC Unit';
    entity.scheduledDate = new Date(2024, 5, 15);
    entity.scheduledStartTime = '09:00';
    entity.estimatedDuration = 2.5;
    entity.estimatedCost = 150.0;
    entity.actualCost = 175.0;
    entity.assignedTechnicianId = 1;
    entity.requestedById = 2;
    entity.startedAt = new Date(2024, 5, 15, 9, 0);
    entity.completedAt = new Date(2024, 5, 15, 11, 30);
    entity.workPerformed = 'Replaced compressor';
    entity.materialsUsed = 'Compressor, filters';
    entity.createdAt = new Date(2024, 5, 15);
    entity.updatedAt = new Date(2024, 5, 15);

    expect(entity.id).toBe(1);
    expect(entity.title).toBe('Fix AC');
    expect(entity.type).toBe(MaintenanceType.CORRECTIVE);
    expect(entity.priority).toBe(MaintenancePriority.HIGH);
    expect(entity.location).toBe('Room 205');
    expect(entity.estimatedDuration).toBe(2.5);
    expect(entity.actualCost).toBe(175.0);
  });

  it('should allow optional fields to be undefined', () => {
    const entity = new GeneralMaintenanceRequest();
    entity.id = 1;
    entity.title = 'Test';
    entity.type = MaintenanceType.PREVENTIVE;
    entity.priority = MaintenancePriority.LOW;
    entity.location = 'Lobby';

    expect(entity.description).toBeUndefined();
    expect(entity.equipment).toBeUndefined();
    expect(entity.scheduledDate).toBeUndefined();
    expect(entity.scheduledStartTime).toBeUndefined();
    expect(entity.estimatedDuration).toBeUndefined();
    expect(entity.estimatedCost).toBeUndefined();
    expect(entity.actualCost).toBeUndefined();
    expect(entity.assignedTechnicianId).toBeUndefined();
    expect(entity.requestedById).toBeUndefined();
    expect(entity.startedAt).toBeUndefined();
    expect(entity.completedAt).toBeUndefined();
    expect(entity.workPerformed).toBeUndefined();
    expect(entity.materialsUsed).toBeUndefined();
  });
});
