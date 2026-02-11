import { CleaningTask } from './';
import { CleaningStatus } from '@app/contracts/operations-service';
import { TaskPriority } from '@app/contracts/common';

describe('CleaningTask Entity', () => {
  it('should create an instance with default values', () => {
    const entity = new CleaningTask();
    expect(entity).toBeDefined();
  });

  it('should accept all properties', () => {
    const entity = new CleaningTask();
    entity.id = 1;
    entity.roomNumber = '101';
    entity.status = CleaningStatus.IN_PROGRESS;
    entity.assignedEmployee = 'Maria Garcia';
    entity.notes = 'Deep cleaning';
    entity.startTime = new Date(2024, 5, 15, 9, 0);
    entity.endTime = new Date(2024, 5, 15, 10, 30);
    entity.estimatedTime = 45;
    entity.priority = TaskPriority.HIGH;
    entity.roomId = 1;
    entity.createdAt = new Date(2024, 5, 15);
    entity.updatedAt = new Date(2024, 5, 15);

    expect(entity.id).toBe(1);
    expect(entity.roomNumber).toBe('101');
    expect(entity.status).toBe(CleaningStatus.IN_PROGRESS);
    expect(entity.priority).toBe(TaskPriority.HIGH);
    expect(entity.estimatedTime).toBe(45);
  });

  it('should allow optional fields to be undefined', () => {
    const entity = new CleaningTask();
    entity.id = 1;
    entity.roomNumber = '101';
    entity.roomId = 1;

    expect(entity.assignedEmployee).toBeUndefined();
    expect(entity.notes).toBeUndefined();
    expect(entity.startTime).toBeUndefined();
    expect(entity.endTime).toBeUndefined();
    expect(entity.estimatedTime).toBeUndefined();
  });
});
