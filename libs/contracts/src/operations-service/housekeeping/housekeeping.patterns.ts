export const HOUSEKEEPING_PATTERNS = {
  // Cleaning Task patterns
  CREATE_TASK: 'housekeeping.task.create',
  FIND_ALL_TASKS: 'housekeeping.task.findAll',
  FIND_ONE_TASK: 'housekeeping.task.findOne',
  UPDATE_TASK: 'housekeeping.task.update',
  DELETE_TASK: 'housekeeping.task.delete',

  // Cleaning Assignment patterns
  CREATE_ASSIGNMENT: 'housekeeping.assignment.create',
  FIND_ALL_ASSIGNMENTS: 'housekeeping.assignment.findAll',
  FIND_ONE_ASSIGNMENT: 'housekeeping.assignment.findOne',
  UPDATE_ASSIGNMENT: 'housekeeping.assignment.update',
  DELETE_ASSIGNMENT: 'housekeeping.assignment.delete',

  // Maintenance Report patterns
  CREATE_MAINTENANCE_REPORT: 'housekeeping.maintenanceReport.create',
  FIND_ALL_MAINTENANCE_REPORTS: 'housekeeping.maintenanceReport.findAll',
  FIND_ONE_MAINTENANCE_REPORT: 'housekeeping.maintenanceReport.findOne',
  UPDATE_MAINTENANCE_REPORT: 'housekeeping.maintenanceReport.update',
  DELETE_MAINTENANCE_REPORT: 'housekeeping.maintenanceReport.delete',

  // Maintenance Request patterns
  CREATE_MAINTENANCE_REQUEST: 'housekeeping.maintenanceRequest.create',
  FIND_ALL_MAINTENANCE_REQUESTS: 'housekeeping.maintenanceRequest.findAll',
  FIND_ONE_MAINTENANCE_REQUEST: 'housekeeping.maintenanceRequest.findOne',
  UPDATE_MAINTENANCE_REQUEST: 'housekeeping.maintenanceRequest.update',
  DELETE_MAINTENANCE_REQUEST: 'housekeeping.maintenanceRequest.delete',

  // Statistics and Performance patterns
  GET_STATISTICS: 'housekeeping.statistics.get',
  GET_EMPLOYEE_PERFORMANCE: 'housekeeping.performance.employee',
  GET_CLEANING_PERFORMANCE: 'housekeeping.performance.cleaning',
} as const;
