import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { VenuesService } from './venues.service';
import { CreateVenueDto } from './dto/create-venue.dto';
import { UpdateVenueDto } from './dto/update-venue.dto';
import { AuditLog } from '../audit-service/audit/decorators/audit-log.decorator';
import { AuditResource } from '@app/contracts/audit-service/enums';
import { Venue } from './entities/venue.entity';

@ApiTags('venues')
@Controller('venues')
@AuditLog({ resource: AuditResource.VENUE })
export class VenuesController {
  constructor(private readonly venuesService: VenuesService) {}

  @Post()
  @ApiOperation({
    summary: 'Create Venue',
    description: 'Create a new event venue in the hotel.',
  })
  @ApiBody({
    description: 'Venue creation data',
    type: CreateVenueDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Venue created successfully',
    type: Venue,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request data',
  })
  create(@Body() createVenueDto: CreateVenueDto): Promise<Venue> {
    return this.venuesService.create(createVenueDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get All Venues',
    description:
      'Retrieve all venues with their event bookings, sorted by name.',
  })
  @ApiResponse({
    status: 200,
    description: 'Venues retrieved successfully',
    type: [Venue],
  })
  findAll(): Promise<Venue[]> {
    return this.venuesService.findAll();
  }

  @Get('available')
  @ApiOperation({
    summary: 'Get Available Venues',
    description: 'Retrieve all currently available venues for booking.',
  })
  @ApiResponse({
    status: 200,
    description: 'Available venues retrieved successfully',
    type: [Venue],
  })
  getAvailableVenues(): Promise<Venue[]> {
    return this.venuesService.getAvailableVenues();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get Venue by ID',
    description: 'Retrieve a specific venue by its ID with event bookings.',
  })
  @ApiParam({
    name: 'id',
    description: 'Venue ID',
    type: 'number',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Venue retrieved successfully',
    type: Venue,
  })
  @ApiResponse({
    status: 404,
    description: 'Venue not found',
  })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Venue | null> {
    return this.venuesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update Venue',
    description: 'Update an existing venue (availability, rates, etc.).',
  })
  @ApiParam({
    name: 'id',
    description: 'Venue ID',
    type: 'number',
    example: 1,
  })
  @ApiBody({
    description: 'Venue update data',
    type: UpdateVenueDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Venue updated successfully',
    type: Venue,
  })
  @ApiResponse({
    status: 404,
    description: 'Venue not found',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateVenueDto: UpdateVenueDto,
  ): Promise<Venue> {
    return this.venuesService.update(id, updateVenueDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete Venue',
    description: 'Delete a venue from the system.',
  })
  @ApiParam({
    name: 'id',
    description: 'Venue ID',
    type: 'number',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Venue deleted successfully',
    type: Venue,
  })
  @ApiResponse({
    status: 404,
    description: 'Venue not found',
  })
  remove(@Param('id', ParseIntPipe) id: number): Promise<Venue> {
    return this.venuesService.delete(id);
  }
}
