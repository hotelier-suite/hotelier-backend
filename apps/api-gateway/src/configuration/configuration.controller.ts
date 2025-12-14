import { Controller, Get, Put, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { ConfigurationService } from './configuration.service';
import { UpdateHotelConfigDto } from './dto/update-hotel-config.dto';
import { AuditLog } from '../audit/decorators/audit-log.decorator';
import { AuditResource } from '../audit/enums/audit-resource.enum';
import { HotelConfigDto } from './dto/hotel-config.dto';

@ApiTags('configuration')
@Controller('configuration')
@AuditLog({ resource: AuditResource.CONFIGURATION })
export class ConfigurationController {
  constructor(private readonly configurationService: ConfigurationService) {}

  @Get('hotel')
  @ApiOperation({
    summary: 'Get Hotel Configuration',
    description: 'Retrieve hotel-specific configuration settings.',
  })
  @ApiResponse({
    status: 200,
    description: 'Hotel configuration retrieved successfully',
    type: HotelConfigDto,
  })
  getHotelConfig(): Promise<HotelConfigDto> {
    return this.configurationService.getHotelConfig();
  }

  @Put('hotel')
  @ApiOperation({
    summary: 'Update Hotel Configuration',
    description: 'Update hotel-specific configuration settings.',
  })
  @ApiBody({
    description: 'Hotel configuration update data',
    type: UpdateHotelConfigDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Hotel configuration updated successfully',
    type: HotelConfigDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  async updateHotelConfig(
    @Body() updateData: UpdateHotelConfigDto,
  ): Promise<HotelConfigDto> {
    return this.configurationService.updateHotelConfig(updateData);
  }
}
