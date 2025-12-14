import { OmitType } from '@nestjs/swagger';
import { AnalyticsData } from '../entities/analytics-data.entity';

export class CreateAnalyticsDataDto extends OmitType(AnalyticsData, [
  'id',
  'createdAt',
  'updatedAt',
]) {}
