import { ApiProperty } from '@nestjs/swagger';

export class FinancialReportPdfDto {
  @ApiProperty({
    description: 'PDF file buffer',
    type: 'string',
    format: 'binary',
  })
  buffer: Buffer;

  @ApiProperty({
    description: 'Suggested filename for the PDF',
    example: 'financial-report-2025-1.pdf',
  })
  filename: string;
}
