export const INCIDENTS_PATTERNS = {
  FIND_ALL: 'parking.incidents.findAll',
  FIND_BY_STATUS: 'parking.incidents.findByStatus',
  FIND_BY_PRIORITY: 'parking.incidents.findByPriority',
  FIND_BY_TYPE: 'parking.incidents.findByType',
  FIND_ONE: 'parking.incidents.findOne',
  CREATE: 'parking.incidents.create',
  UPDATE: 'parking.incidents.update',
  RESOLVE: 'parking.incidents.resolve',
  DELETE: 'parking.incidents.delete',
} as const;
