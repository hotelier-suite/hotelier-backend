import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { GuestsService } from './guests.service';
import { CreateGuestDto } from '@app/contracts/booking-service/guests/dto/create-guest.dto';
import { UpdateGuestDto } from '@app/contracts/booking-service/guests/dto/update-guest.dto';
import { GuestDto } from '@app/contracts/booking-service/guests/dto/guest.dto';
import { AuditLog } from '../../audit/decorators/audit-log.decorator';
import { AuditResource } from '../../audit/enums/audit-resource.enum';

@ApiTags('guests')
@ApiBearerAuth()
@Controller('guests')
@AuditLog({ resource: AuditResource.GUEST })
export class GuestsController {
  constructor(private readonly guestsService: GuestsService) {}

  @Get()
  @ApiOperation({
    summary: 'List guests',
    description: 'Retrieve guests, optionally filtered by search term.',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Search by name, email, phone or document',
  })
  @ApiResponse({ status: 200, type: [GuestDto] })
  findAll(@Query('search') search?: string): Observable<GuestDto[]> {
    return this.guestsService.findAll({ search });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get guest by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, type: GuestDto })
  findOne(@Param('id', ParseIntPipe) id: number): Observable<GuestDto> {
    return this.guestsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create guest' })
  @ApiResponse({ status: 201, type: GuestDto })
  create(@Body() data: CreateGuestDto): Observable<GuestDto> {
    return this.guestsService.create(data);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update guest' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, type: GuestDto })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateGuestDto,
  ): Observable<GuestDto> {
    return this.guestsService.update(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete guest' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, type: GuestDto })
  remove(@Param('id', ParseIntPipe) id: number): Observable<GuestDto> {
    return this.guestsService.remove(id);
  }
}
