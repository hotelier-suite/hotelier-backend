export const INVOICES_PATTERNS = {
  CREATE: 'billing.invoice.create',
  FIND_ALL: 'billing.invoice.findAll',
  FIND_ONE: 'billing.invoice.findOne',
  UPDATE: 'billing.invoice.update',
  DELETE: 'billing.invoice.delete',
  MARK_AS_PAID: 'billing.invoice.markAsPaid',
  DOWNLOAD: 'billing.invoice.download',
  FIND_BY_STATUS: 'billing.invoice.findByStatus',
  FIND_BY_DATE_RANGE: 'billing.invoice.findByDateRange',
  FIND_OVERDUE: 'billing.invoice.findOverdue',
  FIND_BY_CUSTOMER: 'billing.invoice.findByCustomer',
} as const;
