import { RolePermission } from './';

describe('RolePermission Entity', () => {
  it('should create a role permission entity with all properties', () => {
    const rp = new RolePermission();
    rp.id = 1;
    rp.roleId = 1;
    rp.permissionId = 5;

    expect(rp.id).toBe(1);
    expect(rp.roleId).toBe(1);
    expect(rp.permissionId).toBe(5);
  });
});
