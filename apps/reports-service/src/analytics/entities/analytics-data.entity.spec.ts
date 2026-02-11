import { AnalyticsData } from './';
import { AnalyticsMetric } from '@app/contracts/reports-service';

describe('AnalyticsData', () => {
  it('should create an instance with all properties', () => {
    const entity = new AnalyticsData();
    entity.id = 1;
    entity.metric = AnalyticsMetric.OCCUPANCY_RATE;
    entity.value = 85.5;
    entity.date = new Date('2024-01-15');
    entity.period = 'Jan-2024';
    entity.metadata = { source: 'manual', department: 'front-desk' };
    entity.createdAt = new Date();
    entity.updatedAt = new Date();

    expect(entity.id).toBe(1);
    expect(entity.metric).toBe(AnalyticsMetric.OCCUPANCY_RATE);
    expect(entity.value).toBe(85.5);
    expect(entity.date).toBeInstanceOf(Date);
    expect(entity.period).toBe('Jan-2024');
    expect(entity.metadata).toEqual({
      source: 'manual',
      department: 'front-desk',
    });
    expect(entity.createdAt).toBeInstanceOf(Date);
    expect(entity.updatedAt).toBeInstanceOf(Date);
  });

  it('should allow optional fields to be undefined', () => {
    const entity = new AnalyticsData();
    entity.id = 2;
    entity.metric = AnalyticsMetric.REVENUE_PER_ROOM;
    entity.value = 100;
    entity.date = new Date();

    expect(entity.id).toBe(2);
    expect(entity.period).toBeUndefined();
    expect(entity.metadata).toBeUndefined();
  });
});
