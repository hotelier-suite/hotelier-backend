export const INVOICES_PATTERNS = {
  CREATE: 'invoices.create',
  FIND_ALL: 'invoices.findAll',
  FIND_ONE: 'invoices.findOne',
  UPDATE: 'invoices.update',
  DELETE: 'invoices.delete',
  MARK_AS_PAID: 'invoices.markAsPaid',
  DOWNLOAD: 'invoices.download',
  FIND_BY_STATUS: 'invoices.findByStatus',
  FIND_BY_DATE_RANGE: 'invoices.findByDateRange',
  FIND_OVERDUE: 'invoices.findOverdue',
  FIND_BY_CUSTOMER: 'invoices.findByCustomer',
} as const;
