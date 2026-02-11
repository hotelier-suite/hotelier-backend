import { Employee } from './';

describe('Employee Entity', () => {
  it('should create an employee instance', () => {
    const employee = new Employee();
    employee.id = 1;
    employee.employeeId = 'EMP001';
    employee.name = 'Mary Johnson';
    employee.department = 'HOUSEKEEPING' as never;
    employee.position = 'Supervisor';
    employee.shift = 'Morning';
    employee.assignedRooms = 15;
    employee.completedRooms = 14;
    employee.status = 'ACTIVE' as never;
    employee.currentLocation = 'Floor 2';
    employee.createdAt = new Date();
    employee.updatedAt = new Date();

    expect(employee.id).toBe(1);
    expect(employee.employeeId).toBe('EMP001');
    expect(employee.name).toBe('Mary Johnson');
    expect(employee.shift).toBe('Morning');
    expect(employee.assignedRooms).toBe(15);
    expect(employee.completedRooms).toBe(14);
    expect(employee.currentLocation).toBe('Floor 2');
  });

  it('should allow optional fields to be undefined', () => {
    const employee = new Employee();
    employee.id = 2;
    employee.employeeId = 'EMP002';
    employee.name = 'James';
    employee.department = 'FRONT_DESK' as never;
    employee.position = 'Agent';
    employee.createdAt = new Date();
    employee.updatedAt = new Date();

    expect(employee.shift).toBeUndefined();
    expect(employee.currentLocation).toBeUndefined();
  });
});
