import { CleaningAssignment } from './';
import { CleaningStatus } from '@app/contracts/operations-service';

describe('CleaningAssignment Entity', () => {
  it('should create an instance with default values', () => {
    const entity = new CleaningAssignment();
    expect(entity).toBeDefined();
  });

  it('should accept all properties', () => {
    const entity = new CleaningAssignment();
    entity.id = 1;
    entity.assignedDate = new Date(2024, 5, 15);
    entity.startedAt = new Date(2024, 5, 15, 9, 0);
    entity.completedAt = new Date(2024, 5, 15, 10, 30);
    entity.status = CleaningStatus.COMPLETED;
    entity.notes = 'Test notes';
    entity.qualityScore = 9.5;
    entity.employeeId = 1;
    entity.roomId = 101;
    entity.createdAt = new Date(2024, 5, 15);
    entity.updatedAt = new Date(2024, 5, 15);

    expect(entity.id).toBe(1);
    expect(entity.status).toBe(CleaningStatus.COMPLETED);
    expect(entity.qualityScore).toBe(9.5);
    expect(entity.notes).toBe('Test notes');
    expect(entity.roomId).toBe(101);
  });

  it('should allow optional fields to be undefined', () => {
    const entity = new CleaningAssignment();
    entity.id = 1;
    entity.roomId = 1;
    entity.status = CleaningStatus.PENDING;

    expect(entity.startedAt).toBeUndefined();
    expect(entity.completedAt).toBeUndefined();
    expect(entity.notes).toBeUndefined();
    expect(entity.qualityScore).toBeUndefined();
    expect(entity.employeeId).toBeUndefined();
  });
});
