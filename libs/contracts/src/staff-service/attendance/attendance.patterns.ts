export const ATTENDANCE_PATTERNS = {
  FIND_ALL: 'staff.attendance.findAll',
  FIND_BY_ID: 'staff.attendance.findById',
  FIND_BY_EMPLOYEE: 'staff.attendance.findByEmployee',
  FIND_BY_DATE: 'staff.attendance.findByDate',
  FIND_BY_DATE_RANGE: 'staff.attendance.findByDateRange',
  FIND_BY_STATUS: 'staff.attendance.findByStatus',
  CREATE: 'staff.attendance.create',
  UPDATE: 'staff.attendance.update',
  DELETE: 'staff.attendance.delete',
  CHECK_IN: 'staff.attendance.checkIn',
  CHECK_OUT: 'staff.attendance.checkOut',
} as const;
