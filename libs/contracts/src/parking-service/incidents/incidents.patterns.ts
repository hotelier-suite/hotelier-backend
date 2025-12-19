export const INCIDENTS_PATTERNS = {
  GET_ALL: 'parking.incidents.getAll',
  GET_BY_STATUS: 'parking.incidents.getByStatus',
  GET_BY_PRIORITY: 'parking.incidents.getByPriority',
  GET_BY_TYPE: 'parking.incidents.getByType',
  GET_BY_ID: 'parking.incidents.getById',
  CREATE: 'parking.incidents.create',
  UPDATE: 'parking.incidents.update',
  RESOLVE: 'parking.incidents.resolve',
  DELETE: 'parking.incidents.delete',
} as const;
