export const EMPLOYEE_REQUESTS_PATTERNS = {
  FIND_ALL: 'staff.permissions.findAll',
  FIND_ONE: 'staff.permissions.findOne',
  FIND_BY_EMPLOYEE: 'staff.permissions.findByEmployee',
  FIND_BY_STATUS: 'staff.permissions.findByStatus',
  FIND_BY_TYPE: 'staff.permissions.findByType',
  FIND_BY_DATE_RANGE: 'staff.permissions.findByDateRange',
  CREATE: 'staff.permissions.create',
  UPDATE: 'staff.permissions.update',
  APPROVE: 'staff.permissions.approve',
  REJECT: 'staff.permissions.reject',
  DELETE: 'staff.permissions.delete',
} as const;
