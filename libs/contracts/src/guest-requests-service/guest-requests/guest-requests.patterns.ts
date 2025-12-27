export const GUEST_REQUESTS_PATTERNS = {
  FIND_ALL: 'guestRequests.guestRequests.findAll',
  FIND_ONE: 'guestRequests.guestRequests.findOne',
  FIND_BY_STATUS: 'guestRequests.guestRequests.findByStatus',
  FIND_BY_PRIORITY: 'guestRequests.guestRequests.findByPriority',
  CREATE: 'guestRequests.guestRequests.create',
  UPDATE: 'guestRequests.guestRequests.update',
  DELETE: 'guestRequests.guestRequests.delete',
  COUNT_BY_STATUS: 'guestRequests.guestRequests.countByStatus',
  FIND_RECENT: 'guestRequests.guestRequests.findRecent',
} as const;
