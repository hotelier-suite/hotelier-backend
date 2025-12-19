export const VEHICLES_PATTERNS = {
  GET_ALL: 'parking.vehicles.getAll',
  GET_BY_ID: 'parking.vehicles.getById',
  GET_BY_LICENSE_PLATE: 'parking.vehicles.getByLicensePlate',
  GET_BY_STATUS: 'parking.vehicles.getByStatus',
  GET_BY_GUEST_TYPE: 'parking.vehicles.getByGuestType',
  CREATE: 'parking.vehicles.create',
  UPDATE: 'parking.vehicles.update',
  CHECKOUT: 'parking.vehicles.checkout',
  DELETE: 'parking.vehicles.delete',
} as const;
