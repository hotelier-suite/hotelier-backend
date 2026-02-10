export const INVOICES_PATTERNS = {
  CREATE: 'invoices.create',
  FIND_ALL: 'invoices.findAll',
  FIND_ONE: 'invoices.findOne',
  UPDATE: 'invoices.update',
  DELETE: 'invoices.delete',
  MARK_AS_PAID: 'invoices.markAsPaid',
  GENERATE_PDF: 'invoices.generatePdf',
} as const;
