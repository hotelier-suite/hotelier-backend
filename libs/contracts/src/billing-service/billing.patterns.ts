export const BILLING_PATTERNS = {
  // Invoice patterns
  INVOICE_CREATE: 'billing.invoice.create',
  INVOICE_FIND_ALL: 'billing.invoice.findAll',
  INVOICE_FIND_ONE: 'billing.invoice.findOne',
  INVOICE_UPDATE: 'billing.invoice.update',
  INVOICE_DELETE: 'billing.invoice.delete',
  INVOICE_MARK_AS_PAID: 'billing.invoice.markAsPaid',
  INVOICE_DOWNLOAD: 'billing.invoice.download',
  INVOICE_FIND_BY_STATUS: 'billing.invoice.findByStatus',
  INVOICE_FIND_BY_DATE_RANGE: 'billing.invoice.findByDateRange',
  INVOICE_FIND_OVERDUE: 'billing.invoice.findOverdue',
  INVOICE_FIND_BY_CUSTOMER: 'billing.invoice.findByCustomer',

  // Payment patterns
  PAYMENT_CREATE: 'billing.payment.create',
  PAYMENT_FIND_ALL: 'billing.payment.findAll',
  PAYMENT_FIND_ONE: 'billing.payment.findOne',
  PAYMENT_FIND_BY_INVOICE: 'billing.payment.findByInvoice',

  // Statistics patterns
  STATISTICS_FINANCIAL_SUMMARY: 'billing.statistics.financialSummary',
  STATISTICS_PAYMENTS: 'billing.statistics.payments',
  STATISTICS_MONTHLY_REPORT: 'billing.statistics.monthlyReport',
} as const;
