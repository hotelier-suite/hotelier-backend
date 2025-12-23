export const RECREATIONAL_BOOKINGS_PATTERNS = {
  CREATE: 'recreational.booking.create',
  FIND_ALL: 'recreational.booking.findAll',
  FIND_ONE: 'recreational.booking.findOne',
  UPDATE: 'recreational.booking.update',
  DELETE: 'recreational.booking.delete',
  CANCEL: 'recreational.booking.cancel',
  CHECK_IN: 'recreational.booking.checkIn',
  CHECK_OUT: 'recreational.booking.checkOut',
  FIND_BY_DATE: 'recreational.booking.findByDate',
  FIND_BY_FACILITY: 'recreational.booking.findByFacility',
  GET_STATISTICS: 'recreational.booking.getStatistics',
} as const;
