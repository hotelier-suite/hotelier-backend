import { OmitType } from '@nestjs/swagger';
import { Report } from '../entities/report.entity';

export class CreateReportDto extends OmitType(Report, [
  'id',
  'data',
  'filePath',
  'createdAt',
  'updatedAt',
]) {}
