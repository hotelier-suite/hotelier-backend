import { UserRole } from './';

describe('UserRole Entity', () => {
  it('should create a user role entity with all properties', () => {
    const userRole = new UserRole();
    userRole.id = 1;
    userRole.userId = 1;
    userRole.roleId = 2;
    userRole.assignedBy = 'system';

    expect(userRole.id).toBe(1);
    expect(userRole.userId).toBe(1);
    expect(userRole.roleId).toBe(2);
    expect(userRole.assignedBy).toBe('system');
  });

  it('should allow assignedBy to be undefined', () => {
    const userRole = new UserRole();
    userRole.id = 1;
    userRole.userId = 1;
    userRole.roleId = 2;

    expect(userRole.assignedBy).toBeUndefined();
  });
});
