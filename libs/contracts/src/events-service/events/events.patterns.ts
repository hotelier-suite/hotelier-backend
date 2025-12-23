export const EVENTS_PATTERNS = {
  // Event patterns
  CREATE: 'events.create',
  FIND_ALL: 'events.findAll',
  FIND_ONE: 'events.findOne',
  UPDATE: 'events.update',
  DELETE: 'events.delete',

  // Event Booking patterns
  CREATE_BOOKING: 'events.booking.create',
  FIND_ALL_BOOKINGS: 'events.booking.findAll',
  FIND_ONE_BOOKING: 'events.booking.findOne',
  UPDATE_BOOKING: 'events.booking.update',
  DELETE_BOOKING: 'events.booking.delete',
  GET_UPCOMING_BOOKINGS: 'events.booking.upcoming',
} as const;
