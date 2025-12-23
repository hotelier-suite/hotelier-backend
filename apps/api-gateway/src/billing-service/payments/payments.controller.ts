import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { PaymentsService } from './payments.service';
import { PaymentDto } from '@app/contracts/billing-service/payments/dto';

@ApiTags('billing')
@Controller('billing/payments')
@ApiBearerAuth()
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get()
  @ApiOperation({
    summary: 'Get All Payments',
    description: 'Retrieve all payment records.',
  })
  @ApiResponse({
    status: 200,
    description: 'Payments retrieved successfully',
    type: [PaymentDto],
  })
  getPayments(): Observable<PaymentDto[]> {
    return this.paymentsService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get Payment by ID',
    description: 'Retrieve a specific payment by its ID.',
  })
  @ApiParam({
    name: 'id',
    description: 'Payment ID',
    example: 1,
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Payment retrieved successfully',
    type: PaymentDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Payment not found',
  })
  getPaymentById(
    @Param('id', ParseIntPipe) id: number,
  ): Observable<PaymentDto> {
    return this.paymentsService.findOne(id);
  }

  @Get('invoice/:invoiceId')
  @ApiOperation({
    summary: 'Get Payments by Invoice',
    description: 'Retrieve all payments associated with a specific invoice.',
  })
  @ApiParam({
    name: 'invoiceId',
    description: 'Invoice ID',
    example: 1,
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Payments retrieved successfully',
    type: [PaymentDto],
  })
  getPaymentsByInvoice(
    @Param('invoiceId', ParseIntPipe) invoiceId: number,
  ): Observable<PaymentDto[]> {
    return this.paymentsService.findByInvoice(invoiceId);
  }
}
