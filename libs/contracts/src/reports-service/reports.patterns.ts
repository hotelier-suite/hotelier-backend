export const REPORTS_PATTERNS = {
  CREATE: 'reports.create',
  FIND_ALL: 'reports.findAll',
  FIND_ONE: 'reports.findOne',
  UPDATE: 'reports.update',
  DELETE: 'reports.delete',
  GENERATE_OCCUPANCY: 'reports.generate.occupancy',
  GENERATE_REVENUE: 'reports.generate.revenue',
  GENERATE_GUEST_SATISFACTION: 'reports.generate.guestSatisfaction',
  GET_FINANCIAL_SUMMARY: 'reports.analytics.financialSummary',
  GET_OCCUPANCY_BY_MONTH_YEAR: 'reports.analytics.occupancyByMonthYear',
  GET_MONTHLY_REVENUE_COMPARISON: 'reports.analytics.monthlyRevenueComparison',
  GENERATE_FINANCIAL_REPORT_PDF: 'reports.download.financialReport',
} as const;
