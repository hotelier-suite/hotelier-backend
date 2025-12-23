export const AUDIT_PATTERNS = {
  // Audit log patterns
  LOG_CREATE: 'audit.log.create',
  LOG_FIND_ALL: 'audit.log.findAll',
  LOG_FIND_ONE: 'audit.log.findOne',
  LOG_FIND_BY_USER: 'audit.log.findByUser',
  LOG_FIND_BY_RESOURCE: 'audit.log.findByResource',
  LOG_FIND_BY_ACTION: 'audit.log.findByAction',
  LOG_GET_STATISTICS: 'audit.log.getStatistics',
  LOG_CLEAN_OLD: 'audit.log.cleanOld',
} as const;
