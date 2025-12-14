import { OmitType } from '@nestjs/swagger';
import { InvoiceItem } from '../entities/invoice-item.entity';

export class CreateInvoiceItemDto extends OmitType(InvoiceItem, [
  'id',
  'invoiceId',
  'invoice',
]) {}
