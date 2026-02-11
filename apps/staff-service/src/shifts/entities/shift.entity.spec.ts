import { Shift } from './';

describe('Shift Entity', () => {
  it('should create a shift instance', () => {
    const shift = new Shift();
    shift.id = 1;
    shift.date = new Date(2024, 5, 15);
    shift.startTime = '08:00';
    shift.endTime = '16:00';
    shift.type = 'MORNING' as never;
    shift.status = 'SCHEDULED' as never;
    shift.position = 'Supervisor';
    shift.department = 'Housekeeping';
    shift.notes = 'Morning shift';
    shift.employeeId = 1;
    shift.createdAt = new Date();
    shift.updatedAt = new Date();

    expect(shift.id).toBe(1);
    expect(shift.startTime).toBe('08:00');
    expect(shift.endTime).toBe('16:00');
    expect(shift.position).toBe('Supervisor');
    expect(shift.department).toBe('Housekeeping');
    expect(shift.notes).toBe('Morning shift');
    expect(shift.employeeId).toBe(1);
  });

  it('should allow optional notes to be undefined', () => {
    const shift = new Shift();
    shift.id = 2;
    shift.date = new Date();
    shift.startTime = '09:00';
    shift.endTime = '17:00';
    shift.type = 'MORNING' as never;
    shift.status = 'SCHEDULED' as never;
    shift.position = 'Agent';
    shift.department = 'Reception';
    shift.employeeId = 2;
    shift.createdAt = new Date();
    shift.updatedAt = new Date();

    expect(shift.notes).toBeUndefined();
  });
});
