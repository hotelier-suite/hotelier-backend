import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { PaymentsService } from './payments.service';
import {
  FindPaymentsFilterDto,
  PaymentDto,
} from '@app/contracts/billing-service';

@ApiTags('billing')
@Controller('billing/payments')
@ApiBearerAuth()
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get()
  @ApiOperation({
    summary: 'Get All Payments',
    description:
      'Retrieve all payment records. Optionally filter by invoice ID.',
  })
  @ApiResponse({
    status: 200,
    description: 'Payments retrieved successfully',
    type: [PaymentDto],
  })
  findAll(@Query() filters: FindPaymentsFilterDto): Observable<PaymentDto[]> {
    return this.paymentsService.findAll(filters);
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
  findOne(@Param('id', ParseIntPipe) id: number): Observable<PaymentDto> {
    return this.paymentsService.findOne(id);
  }
}
