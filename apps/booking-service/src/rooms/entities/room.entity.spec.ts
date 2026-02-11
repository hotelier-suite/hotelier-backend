import { Room } from './';

describe('Room Entity', () => {
  it('should create a room instance with all properties', () => {
    const room = new Room();
    room.id = 1;
    room.number = '101';
    room.type = 'INDIVIDUAL' as never;
    room.price = 50.0;
    room.capacity = 1;
    room.isAvailable = true;
    room.description = 'Single room';
    room.createdAt = new Date(2024, 5, 15);
    room.updatedAt = new Date(2024, 5, 15);

    expect(room.id).toBe(1);
    expect(room.number).toBe('101');
    expect(room.price).toBe(50.0);
    expect(room.capacity).toBe(1);
    expect(room.isAvailable).toBe(true);
    expect(room.description).toBe('Single room');
    expect(room.createdAt).toBeInstanceOf(Date);
    expect(room.updatedAt).toBeInstanceOf(Date);
  });

  it('should allow optional description to be undefined', () => {
    const room = new Room();
    room.id = 2;
    room.number = '102';
    room.price = 75;
    room.capacity = 2;
    room.isAvailable = true;
    room.createdAt = new Date();
    room.updatedAt = new Date();

    expect(room.description).toBeUndefined();
  });
});
