export const BILLING_PATTERNS = {
  // Invoice patterns
  INVOICE_CREATE: 'invoices.create',
  INVOICE_FIND_ALL: 'invoices.findAll',
  INVOICE_FIND_ONE: 'invoices.findOne',
  INVOICE_UPDATE: 'invoices.update',
  INVOICE_DELETE: 'invoices.delete',
  INVOICE_MARK_AS_PAID: 'invoices.markAsPaid',
  INVOICE_DOWNLOAD: 'invoices.download',
  INVOICE_FIND_BY_STATUS: 'invoices.findByStatus',
  INVOICE_FIND_BY_DATE_RANGE: 'invoices.findByDateRange',
  INVOICE_FIND_OVERDUE: 'invoices.findOverdue',
  INVOICE_FIND_BY_CUSTOMER: 'invoices.findByCustomer',

  // Payment patterns
  PAYMENT_CREATE: 'payments.create',
  PAYMENT_FIND_ALL: 'payments.findAll',
  PAYMENT_FIND_ONE: 'payments.findOne',
  PAYMENT_FIND_BY_INVOICE: 'payments.findByInvoice',

  // Statistics patterns
  STATISTICS_FINANCIAL_SUMMARY: 'statistics.financialSummary',
  STATISTICS_PAYMENTS: 'statistics.payments',
  STATISTICS_MONTHLY_REPORT: 'statistics.monthlyReport',
} as const;
