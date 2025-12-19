import { OmitType } from '@nestjs/swagger';
import { Invoice } from '../entities/invoice.entity';

export class CreateInvoiceDto extends OmitType(Invoice, [
  'id',
  'number',
  'createdAt',
  'updatedAt',
  'invoiceItems',
  'payments',
]) {}
