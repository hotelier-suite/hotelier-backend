import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsOptional, IsString, Length } from 'class-validator';
import { CreateReportDto } from './create-report.dto';

export class UpdateReportDto extends PartialType(CreateReportDto) {
  @ApiProperty({
    description: 'Generated report data in JSON format',
    example: { totalRooms: 150, occupiedRooms: 120, occupancyRate: 80 },
    required: false,
  })
  @IsOptional()
  data?: object;

  @ApiProperty({
    description: 'File path where the report is stored',
    example: '/reports/2024/01/occupancy-report-2024-01.pdf',
    required: false,
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @Length(1, 500)
  filePath?: string;
}
