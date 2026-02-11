import { Attendance } from './';

describe('Attendance Entity', () => {
  it('should create an attendance entity with all properties', () => {
    const attendance = new Attendance();
    attendance.id = 1;
    attendance.date = new Date(2024, 5, 15);
    attendance.checkIn = '08:00';
    attendance.checkOut = '16:00';
    attendance.status = 'PRESENT' as never;
    attendance.notes = 'On-time arrival';
    attendance.hoursWorked = 8;
    attendance.overtimeHours = 0;
    attendance.employeeId = 1;

    expect(attendance.id).toBe(1);
    expect(attendance.date).toEqual(new Date(2024, 5, 15));
    expect(attendance.checkIn).toBe('08:00');
    expect(attendance.checkOut).toBe('16:00');
    expect(attendance.status).toBe('PRESENT');
    expect(attendance.notes).toBe('On-time arrival');
    expect(attendance.hoursWorked).toBe(8);
    expect(attendance.overtimeHours).toBe(0);
    expect(attendance.employeeId).toBe(1);
  });

  it('should allow optional fields to be undefined', () => {
    const attendance = new Attendance();
    attendance.id = 2;
    attendance.date = new Date(2024, 5, 15);
    attendance.employeeId = 1;

    expect(attendance.checkIn).toBeUndefined();
    expect(attendance.checkOut).toBeUndefined();
    expect(attendance.notes).toBeUndefined();
  });
});
