import { EmployeeRequest } from './';

describe('EmployeeRequest Entity', () => {
  it('should create an employee request entity with all properties', () => {
    const request = new EmployeeRequest();
    request.id = 1;
    request.type = 'VACATION' as never;
    request.reason = 'Family vacation';
    request.startDate = new Date(2024, 5, 15);
    request.endDate = new Date(2024, 5, 20);
    request.days = 5;
    request.status = 'PENDING' as never;
    request.approvedBy = 'Manager';
    request.employeeId = 1;

    expect(request.id).toBe(1);
    expect(request.type).toBe('VACATION');
    expect(request.reason).toBe('Family vacation');
    expect(request.startDate).toEqual(new Date(2024, 5, 15));
    expect(request.endDate).toEqual(new Date(2024, 5, 20));
    expect(request.days).toBe(5);
    expect(request.status).toBe('PENDING');
    expect(request.approvedBy).toBe('Manager');
    expect(request.employeeId).toBe(1);
  });

  it('should allow optional fields to be undefined', () => {
    const request = new EmployeeRequest();
    request.id = 2;
    request.type = 'SICK_LEAVE' as never;
    request.reason = 'Feeling ill';
    request.employeeId = 1;

    expect(request.approvedBy).toBeUndefined();
  });
});
