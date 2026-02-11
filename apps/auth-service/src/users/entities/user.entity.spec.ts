import { User } from './';

describe('User Entity', () => {
  it('should create a user entity with all properties', () => {
    const user = new User();
    user.id = 1;
    user.email = 'admin@test.com';
    user.password = 'hashed';
    user.name = 'Admin';
    user.phone = '+1234567890';
    user.loyaltyPoints = 100;
    user.loyaltyLevel = 'PLATINUM' as never;
    user.preferences = 'sea view';
    user.isActive = true;

    expect(user.id).toBe(1);
    expect(user.email).toBe('admin@test.com');
    expect(user.name).toBe('Admin');
    expect(user.phone).toBe('+1234567890');
    expect(user.loyaltyPoints).toBe(100);
    expect(user.isActive).toBe(true);
  });

  it('should allow optional fields to be undefined', () => {
    const user = new User();
    user.id = 1;
    user.email = 'test@test.com';
    user.name = 'Test';

    expect(user.phone).toBeUndefined();
    expect(user.preferences).toBeUndefined();
    expect(user.lastVisit).toBeUndefined();
    expect(user.firstVisit).toBeUndefined();
    expect(user.lastLogin).toBeUndefined();
    expect(user.refreshToken).toBeUndefined();
  });
});
