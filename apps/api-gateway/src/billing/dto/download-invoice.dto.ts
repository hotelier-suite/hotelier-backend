import { IsNotEmpty, IsString } from 'class-validator';

export class DownloadInvoiceDto {
  @IsNotEmpty()
  @IsString()
  invoiceId: string;
}
