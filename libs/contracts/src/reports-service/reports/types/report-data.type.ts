import { OccupancyReportDataDto } from '../dto/occupancy-report-data.dto';
import { RevenueReportDataDto } from '../dto/revenue-report-data.dto';
import { FinancialSummaryDto } from '../dto/financial-summary.dto';
import { StaffReportDataDto } from '../dto/staff-report-data.dto';
import { GuestSatisfactionReportDataDto } from '../dto/guest-satisfaction-report-data.dto';
import { MaintenanceReportDataDto } from '../dto/maintenance-report-data.dto';
import { CustomReportDataDto } from '../dto/custom-report-data.dto';

export type ReportData =
  | OccupancyReportDataDto
  | RevenueReportDataDto
  | FinancialSummaryDto
  | StaffReportDataDto
  | GuestSatisfactionReportDataDto
  | MaintenanceReportDataDto
  | CustomReportDataDto;
