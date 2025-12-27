export const RESERVATIONS_PATTERNS = {
  FIND_ALL: 'booking.reservations.findAll',
  FIND_ONE: 'booking.reservations.findOne',
  FIND_MINE: 'booking.reservations.findMine',
  FIND_CURRENT: 'booking.reservations.findCurrent',
  GET_AVAILABILITY: 'booking.reservations.getAvailability',
  CREATE: 'booking.reservations.create',
  UPDATE: 'booking.reservations.update',
  DELETE: 'booking.reservations.delete',
  CHECKOUT: 'booking.reservations.checkout',
} as const;
