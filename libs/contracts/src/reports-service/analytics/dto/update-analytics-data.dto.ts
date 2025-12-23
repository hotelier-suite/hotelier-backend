import { PartialType } from '@nestjs/swagger';
import { CreateAnalyticsDataDto } from './create-analytics-data.dto';

export class UpdateAnalyticsDataDto extends PartialType(CreateAnalyticsDataDto) {}
