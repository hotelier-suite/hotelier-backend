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
  ApiBody,
} from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { VenuesService } from './venues.service';
import {
  VenueDto,
  CreateVenueDto,
  UpdateVenueDto,
  FindVenuesFilterDto,
} from '@app/contracts/events-service';

@ApiTags('venues')
@Controller('venues')
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
    type: VenueDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request data',
  })
  create(@Body() createVenueDto: CreateVenueDto): Observable<VenueDto> {
    return this.venuesService.create(createVenueDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get All Venues',
    description: 'Retrieve all venues with optional filters, sorted by name.',
  })
  @ApiResponse({
    status: 200,
    description: 'Venues retrieved successfully',
    type: [VenueDto],
  })
  findAll(@Query() filters: FindVenuesFilterDto): Observable<VenueDto[]> {
    return this.venuesService.findAll(filters);
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
    type: VenueDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Venue not found',
  })
  findOne(@Param('id', ParseIntPipe) id: number): Observable<VenueDto> {
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
    type: VenueDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Venue not found',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateVenueDto: UpdateVenueDto,
  ): Observable<VenueDto> {
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
    type: VenueDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Venue not found',
  })
  remove(@Param('id', ParseIntPipe) id: number): Observable<VenueDto> {
    return this.venuesService.remove(id);
  }
}
