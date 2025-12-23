import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  Put,
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
import { BillingService } from './billing.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { FinancialSummaryResponseDto } from './dto/financial-summary-response.dto';
import { MarkAsPaidRequestDto } from './dto/mark-as-paid-request.dto';
import { PaymentStatisticsResponseDto } from './dto/payment-statistics-response.dto';
import { Invoice } from './entities/invoice.entity';
import { Payment } from './entities/payment.entity';
import { InvoiceStatus } from './enums/invoice-status.enum';
import { AuditLog } from '../audit-service/audit/decorators/audit-log.decorator';
import { AuditAction, AuditResource } from '@app/contracts/audit-service/enums';

@ApiTags('billing')
@Controller('billing')
@ApiBearerAuth()
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Get('invoices')
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
    type: [Invoice],
  })
  getInvoices(@Query('status') status?: InvoiceStatus): Promise<Invoice[]> {
    if (status) {
      return this.billingService.getInvoicesByStatus(status);
    }
    return this.billingService.findAll();
  }

  @Get('invoices/overdue')
  @ApiOperation({
    summary: 'Get Overdue Invoices',
    description: 'Retrieve all invoices that are past their due date.',
  })
  @ApiResponse({
    status: 200,
    description: 'Overdue invoices retrieved successfully',
    type: [Invoice],
  })
  getOverdueInvoices(): Promise<Invoice[]> {
    return this.billingService.getOverdueInvoices();
  }

  @Get('invoices/statistics')
  @ApiOperation({
    summary: 'Get Billing Statistics',
    description: 'Retrieve comprehensive billing statistics.',
  })
  @ApiResponse({
    status: 200,
    description: 'Billing statistics retrieved successfully',
    type: FinancialSummaryResponseDto,
  })
  getBillingStatistics(): Promise<FinancialSummaryResponseDto> {
    const startDate = new Date(new Date().getFullYear(), 0, 1);
    const endDate = new Date();
    return this.billingService.getFinancialSummary(startDate, endDate);
  }

  @Get('invoices/date-range')
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
    type: [Invoice],
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid date format',
  })
  getInvoicesByDateRange(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<Invoice[]> {
    return this.billingService.getInvoicesByDateRange(
      new Date(startDate),
      new Date(endDate),
    );
  }

  @Get('invoices/:id')
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
    type: Invoice,
  })
  @ApiResponse({
    status: 404,
    description: 'Invoice not found',
  })
  getInvoiceById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Invoice | null> {
    return this.billingService.findOne(id);
  }

  @Post('invoices')
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
    type: Invoice,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  createInvoice(@Body() invoiceData: CreateInvoiceDto): Promise<Invoice> {
    return this.billingService.create(invoiceData);
  }

  @Put('invoices/:id')
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
    type: Invoice,
  })
  @ApiResponse({
    status: 404,
    description: 'Invoice not found',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  updateInvoice(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateData: UpdateInvoiceDto,
  ): Promise<Invoice> {
    return this.billingService.updateInvoice(id, updateData);
  }

  @Put('invoices/:id/mark-paid')
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
    type: Invoice,
  })
  @ApiResponse({
    status: 404,
    description: 'Invoice not found',
  })
  markInvoiceAsPaid(
    @Param('id', ParseIntPipe) id: number,
    @Body() paymentData: MarkAsPaidRequestDto,
  ): Promise<Invoice> {
    return this.billingService.markAsPaid(id, paymentData.paymentMethod);
  }

  @Delete('invoices/:id')
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
  deleteInvoice(@Param('id', ParseIntPipe) id: number) {
    return this.billingService.remove(id);
  }

  @Get('payments')
  @ApiOperation({
    summary: 'Get All Payments',
    description: 'Retrieve all payment records.',
  })
  @ApiResponse({
    status: 200,
    description: 'Payments retrieved successfully',
    type: [Payment],
  })
  getPayments(): Promise<Payment[]> {
    return this.billingService.getAllPayments();
  }

  @Get('payments/statistics')
  @ApiOperation({
    summary: 'Get Payment Statistics',
    description: 'Retrieve payment statistics and analytics.',
  })
  @ApiResponse({
    status: 200,
    description: 'Payment statistics retrieved successfully',
    type: PaymentStatisticsResponseDto,
  })
  getPaymentStatistics(): Promise<PaymentStatisticsResponseDto> {
    return this.billingService.getPaymentStatistics();
  }

  @Get('invoices/:id/payments')
  @ApiOperation({
    summary: 'Get Payments by Invoice',
    description: 'Retrieve all payments associated with a specific invoice.',
  })
  @ApiParam({
    name: 'id',
    description: 'Invoice ID',
    example: 1,
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Payments retrieved successfully',
    type: [Payment],
  })
  @ApiResponse({
    status: 404,
    description: 'Invoice not found',
  })
  getPaymentsByInvoice(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Payment[]> {
    return this.billingService.getPaymentsByInvoiceId(id);
  }

  @Get('invoices/:id/download')
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
    return this.billingService.generateInvoicePdf(id);
  }
}
