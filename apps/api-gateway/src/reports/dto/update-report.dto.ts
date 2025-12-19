import { PartialType } from '@nestjs/swagger';
import { CreateReportDto } from './create-report.dto';
import { Report } from '../entities/report.entity';

export class UpdateReportDto extends PartialType(CreateReportDto) {
  data?: Report['data'];
  filePath?: Report['filePath'];
}
