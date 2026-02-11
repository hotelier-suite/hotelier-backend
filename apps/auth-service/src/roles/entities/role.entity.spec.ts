import { Role } from './';

describe('Role Entity', () => {
  it('should create a role entity with all properties', () => {
    const role = new Role();
    role.id = 1;
    role.name = 'administrator';
    role.description = 'System Admin';
    role.isSystem = true;

    expect(role.id).toBe(1);
    expect(role.name).toBe('administrator');
    expect(role.description).toBe('System Admin');
    expect(role.isSystem).toBe(true);
  });

  it('should allow optional fields to be undefined', () => {
    const role = new Role();
    role.id = 1;
    role.name = 'custom';

    expect(role.description).toBeUndefined();
  });
});
