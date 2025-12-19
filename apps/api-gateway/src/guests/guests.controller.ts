import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { GuestsService } from './guests.service';
import { CreateGuestDto } from './dto/create-guest.dto';
import { UpdateGuestDto } from './dto/update-guest.dto';
import { Guest } from '../reservations/entities/guest.entity';
import { AuditLog } from '../audit/decorators/audit-log.decorator';
import { AuditResource } from '../audit/enums/audit-resource.enum';

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
  @ApiResponse({ status: 200, type: [Guest] })
  findAll(@Query('search') search?: string): Promise<Guest[]> {
    return this.guestsService.findAll({ search });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get guest by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, type: Guest })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Guest | null> {
    return this.guestsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create guest' })
  @ApiResponse({ status: 201, type: Guest })
  create(@Body() data: CreateGuestDto): Promise<Guest> {
    return this.guestsService.create(data);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update guest' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, type: Guest })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateGuestDto,
  ): Promise<Guest> {
    return this.guestsService.update(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete guest' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, type: Guest })
  remove(@Param('id', ParseIntPipe) id: number): Promise<Guest> {
    return this.guestsService.remove(id);
  }
}
