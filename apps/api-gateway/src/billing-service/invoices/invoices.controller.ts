import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
  ParseDatePipe,
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
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { InvoicesService } from './invoices.service';
import {
  InvoiceDto,
  CreateInvoiceDto,
  UpdateInvoiceDto,
  MarkAsPaidRequestDto,
  InvoiceStatus,
} from '@app/contracts/billing-service';
import { AuditLog } from '../../audit-service';
import { AuditAction, AuditResource } from '@app/contracts/audit-service';

@ApiTags('billing')
@Controller('billing/invoices')
@ApiBearerAuth()
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Get()
  @ApiOperation({
    summary: 'Get All Invoices',
    description:
      'Retrieve all invoices. Optionally filter by status and/or date range.',
  })
  @ApiQuery({
    name: 'status',
    enum: InvoiceStatus,
    required: false,
    description: 'Filter by invoice status',
    example: InvoiceStatus.PENDING,
  })
  @ApiQuery({
    name: 'startDate',
    required: false,
    description: 'Filter by start date (ISO 8601 format)',
    example: '2024-01-01',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    description: 'Filter by end date (ISO 8601 format)',
    example: '2024-12-31',
  })
  @ApiResponse({
    status: 200,
    description: 'Invoices retrieved successfully',
    type: [InvoiceDto],
  })
  findAll(
    @Query('status') status?: InvoiceStatus,
    @Query('startDate', ParseDatePipe) startDate?: Date,
    @Query('endDate', ParseDatePipe) endDate?: Date,
  ): Observable<InvoiceDto[]> {
    return this.invoicesService.findAll(status, startDate, endDate);
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
  findOne(@Param('id', ParseIntPipe) id: number): Observable<InvoiceDto> {
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
  create(@Body() invoiceData: CreateInvoiceDto): Observable<InvoiceDto> {
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
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateData: UpdateInvoiceDto,
  ): Observable<InvoiceDto> {
    return this.invoicesService.update(id, updateData);
  }

  @Patch(':id/mark-paid')
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
  markAsPaid(
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
  remove(@Param('id', ParseIntPipe) id: number): Observable<InvoiceDto> {
    return this.invoicesService.remove(id);
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
  download(@Param('id', ParseIntPipe) id: number): Observable<StreamableFile> {
    return this.invoicesService.generatePdf(id).pipe(
      map(
        (result) =>
          new StreamableFile(Buffer.from(result.buffer), {
            type: 'application/pdf',
            disposition: `attachment; filename="${result.filename}"`,
          }),
      ),
    );
  }
}
