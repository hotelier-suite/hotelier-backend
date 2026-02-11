import { Report } from './';
import { ReportType, ReportStatus } from '@app/contracts/reports-service';

describe('Report', () => {
  it('should create an instance with all properties', () => {
    const entity = new Report();
    entity.id = 1;
    entity.title = 'Monthly Occupancy Report';
    entity.type = ReportType.OCCUPANCY;
    entity.status = ReportStatus.COMPLETED;
    entity.startDate = new Date('2024-01-01');
    entity.endDate = new Date('2024-01-31');
    entity.parameters = {
      reportType: 'occupancy',
      dateRange: {
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-31'),
      },
    };
    entity.generatedBy = 'admin@hotel.com';
    entity.createdAt = new Date();
    entity.updatedAt = new Date();

    expect(entity.id).toBe(1);
    expect(entity.title).toBe('Monthly Occupancy Report');
    expect(entity.type).toBe(ReportType.OCCUPANCY);
    expect(entity.status).toBe(ReportStatus.COMPLETED);
    expect(entity.startDate).toBeInstanceOf(Date);
    expect(entity.endDate).toBeInstanceOf(Date);
    expect(entity.parameters).toBeDefined();
    expect(entity.generatedBy).toBe('admin@hotel.com');
  });

  it('should allow optional fields to be undefined', () => {
    const entity = new Report();
    entity.id = 2;
    entity.title = 'Test Report';
    entity.type = ReportType.REVENUE;
    entity.generatedBy = 'system@hotel.com';

    expect(entity.parameters).toBeUndefined();
    expect(entity.data).toBeUndefined();
    expect(entity.filePath).toBeUndefined();
  });
});
