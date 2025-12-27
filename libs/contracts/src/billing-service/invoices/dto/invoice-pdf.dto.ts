import { ApiProperty } from '@nestjs/swagger';

export class InvoicePdfDto {
  @ApiProperty({
    description: 'PDF file buffer',
    type: 'string',
    format: 'binary',
  })
  buffer: Buffer;

  @ApiProperty({
    description: 'Suggested filename for the PDF',
    example: 'invoice-INV-1234567890.pdf',
  })
  filename: string;
}
