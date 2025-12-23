import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
  StreamableFile,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { Observable, map } from 'rxjs';
import { InvoicesService } from './invoices.service';
import {
  InvoiceDto,
  CreateInvoiceDto,
  UpdateInvoiceDto,
  MarkAsPaidRequestDto,
} from '@app/contracts/billing-service/invoices/dto';
import { InvoiceStatus } from '@app/contracts/billing-service/invoices/enums/invoice-status.enum';
import { AuditLog } from '../../audit-service/audit/decorators/audit-log.decorator';
import { AuditAction, AuditResource } from '@app/contracts/audit-service/enums';
import * as PDFDocument from 'pdfkit';

@ApiTags('billing')
@Controller('billing/invoices')
@ApiBearerAuth()
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Get()
  @ApiOperation({
    summary: 'Get Invoices',
    description: 'Retrieve all invoices or filter by status.',
  })
  @ApiQuery({
    name: 'status',
    description: 'Filter invoices by status',
    enum: InvoiceStatus,
    required: false,
  })
  @ApiResponse({
    status: 200,
    description: 'Invoices retrieved successfully',
    type: [InvoiceDto],
  })
  getInvoices(@Query('status') status?: InvoiceStatus): Observable<InvoiceDto[]> {
    if (status) {
      return this.invoicesService.findByStatus(status);
    }
    return this.invoicesService.findAll();
  }

  @Get('overdue')
  @ApiOperation({
    summary: 'Get Overdue Invoices',
    description: 'Retrieve all invoices that are past their due date.',
  })
  @ApiResponse({
    status: 200,
    description: 'Overdue invoices retrieved successfully',
    type: [InvoiceDto],
  })
  getOverdueInvoices(): Observable<InvoiceDto[]> {
    return this.invoicesService.findOverdue();
  }

  @Get('date-range')
  @ApiOperation({
    summary: 'Get Invoices by Date Range',
    description: 'Retrieve invoices within a specific date range.',
  })
  @ApiQuery({
    name: 'startDate',
    description: 'Start date for filtering (ISO 8601 format)',
    example: '2024-01-01',
  })
  @ApiQuery({
    name: 'endDate',
    description: 'End date for filtering (ISO 8601 format)',
    example: '2024-01-31',
  })
  @ApiResponse({
    status: 200,
    description: 'Invoices retrieved successfully',
    type: [InvoiceDto],
  })
  getInvoicesByDateRange(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Observable<InvoiceDto[]> {
    return this.invoicesService.findByDateRange(startDate, endDate);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get Invoice by ID',
    description: 'Retrieve a specific invoice by its ID.',
  })
  @ApiParam({
    name: 'id',
    description: 'Invoice ID',
    example: 1,
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Invoice retrieved successfully',
    type: InvoiceDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Invoice not found',
  })
  getInvoiceById(@Param('id', ParseIntPipe) id: number): Observable<InvoiceDto> {
    return this.invoicesService.findOne(id);
  }

  @Post()
  @AuditLog({
    action: AuditAction.CREATE,
    resource: AuditResource.INVOICE,
    description: 'Invoice created',
    includeBody: true,
  })
  @ApiOperation({
    summary: 'Create Invoice',
    description: 'Create a new invoice.',
  })
  @ApiBody({
    description: 'Invoice creation data',
    type: CreateInvoiceDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Invoice created successfully',
    type: InvoiceDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  createInvoice(@Body() invoiceData: CreateInvoiceDto): Observable<InvoiceDto> {
    return this.invoicesService.create(invoiceData);
  }

  @Put(':id')
  @AuditLog({
    action: AuditAction.UPDATE,
    resource: AuditResource.INVOICE,
    description: 'Invoice updated',
    resourceIdParam: 'id',
    includeBody: true,
  })
  @ApiOperation({
    summary: 'Update Invoice',
    description: 'Update an existing invoice.',
  })
  @ApiParam({
    name: 'id',
    description: 'Invoice ID',
    example: 1,
    type: Number,
  })
  @ApiBody({
    description: 'Invoice update data',
    type: UpdateInvoiceDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Invoice updated successfully',
    type: InvoiceDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Invoice not found',
  })
  updateInvoice(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateData: UpdateInvoiceDto,
  ): Observable<InvoiceDto> {
    return this.invoicesService.update(id, updateData);
  }

  @Put(':id/mark-paid')
  @AuditLog({
    action: AuditAction.PAYMENT_PROCESSED,
    resource: AuditResource.INVOICE,
    description: 'Invoice marked as paid',
    resourceIdParam: 'id',
    includeBody: true,
  })
  @ApiOperation({
    summary: 'Mark Invoice as Paid',
    description: 'Mark an invoice as paid with a specified payment method.',
  })
  @ApiParam({
    name: 'id',
    description: 'Invoice ID',
    example: 1,
    type: Number,
  })
  @ApiBody({
    description: 'Payment method data',
    type: MarkAsPaidRequestDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Invoice marked as paid successfully',
    type: InvoiceDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Invoice not found',
  })
  markInvoiceAsPaid(
    @Param('id', ParseIntPipe) id: number,
    @Body() paymentData: MarkAsPaidRequestDto,
  ): Observable<InvoiceDto> {
    return this.invoicesService.markAsPaid(id, paymentData.paymentMethod);
  }

  @Delete(':id')
  @AuditLog({
    action: AuditAction.DELETE,
    resource: AuditResource.INVOICE,
    description: 'Invoice deleted',
    resourceIdParam: 'id',
  })
  @ApiOperation({
    summary: 'Delete Invoice',
    description: 'Delete an invoice by ID.',
  })
  @ApiParam({
    name: 'id',
    description: 'Invoice ID',
    example: 1,
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Invoice deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Invoice not found',
  })
  deleteInvoice(@Param('id', ParseIntPipe) id: number): Observable<InvoiceDto> {
    return this.invoicesService.delete(id);
  }

  @Get(':id/download')
  @ApiOperation({
    summary: 'Download Invoice PDF',
    description: 'Download a specific invoice as PDF document.',
  })
  @ApiParam({
    name: 'id',
    description: 'Invoice ID',
    example: 1,
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Invoice PDF downloaded successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Invoice not found',
  })
  async downloadInvoice(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<StreamableFile> {
    return new Promise((resolve, reject) => {
      this.invoicesService.download(id).subscribe({
        next: (invoice) => {
          const doc = new PDFDocument();
          const chunks: Buffer[] = [];

          doc.on('data', (chunk: Buffer) => chunks.push(chunk));

          doc.on('end', () => {
            const result = Buffer.concat(chunks);
            const file = new StreamableFile(result, {
              type: 'application/pdf',
              disposition: `attachment; filename="invoice-${invoice.number}.pdf"`,
            });
            resolve(file);
          });

          doc.on('error', reject);

          // Header
          doc.fontSize(20).text('HOTELIER', { align: 'center' });
          doc.fontSize(16).text('INVOICE', { align: 'center' });
          doc.moveDown();

          // Invoice details
          doc.fontSize(12);
          doc.text(`Invoice Number: ${invoice.number}`);
          doc.text(`Date: ${new Date(invoice.createdAt).toLocaleDateString()}`);
          doc.text(`Status: ${invoice.status}`);
          doc.moveDown();

          // Guest details
          doc.text(`Customer: ${invoice.guestName}`);
          doc.moveDown();

          // Items
          doc.text('DETAILS', { align: 'left' });
          doc.moveDown(0.5);
          invoice.invoiceItems?.forEach((item) => {
            const itemTotal = Number(item.quantity || 0) * Number(item.price || 0);
            doc.text(
              `${item.description} x ${item.quantity} = ${itemTotal.toFixed(2)}`,
            );
          });
          doc.moveDown();

          // Totals
          doc.fontSize(14);
          doc.text(`Subtotal: ${Number(invoice.subtotal).toFixed(2)}`);
          doc.text(`Tax: ${Number(invoice.taxes).toFixed(2)}`);
          doc.text(`Total: ${Number(invoice.total).toFixed(2)}`);

          // Footer
          doc.moveDown(2);
          doc.fontSize(10);
          doc.text('Thank you for your preference', { align: 'center' });

          // Finish
          doc.end();
        },
        error: reject,
      });
    });
  }
}
