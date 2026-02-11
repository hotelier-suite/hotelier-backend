import { SystemPermission } from './';

describe('SystemPermission Entity', () => {
  it('should create a permission entity with all properties', () => {
    const perm = new SystemPermission();
    perm.id = 1;
    perm.resource = 'users';
    perm.action = 'create';
    perm.description = 'Create users';
    perm.active = true;

    expect(perm.id).toBe(1);
    expect(perm.resource).toBe('users');
    expect(perm.action).toBe('create');
    expect(perm.description).toBe('Create users');
    expect(perm.active).toBe(true);
  });

  it('should allow optional fields to be undefined', () => {
    const perm = new SystemPermission();
    perm.id = 1;
    perm.resource = 'rooms';
    perm.action = 'read';

    expect(perm.description).toBeUndefined();
  });
});
