import { Controller, Get, Patch, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuditLog } from '../../audit-service';
import { AuditResource } from '@app/contracts/audit-service';
import {
  HotelConfigDto,
  UpdateHotelConfigDto,
} from '@app/contracts/config-service';
import { Observable } from 'rxjs';
import { ConfigurationService } from './configuration.service';

@ApiTags('configuration')
@Controller('configuration/hotel')
@AuditLog({ resource: AuditResource.CONFIGURATION })
export class ConfigurationController {
  constructor(private readonly configurationService: ConfigurationService) {}

  @Get()
  @ApiOperation({
    summary: 'Get Hotel Configuration',
    description: 'Retrieve hotel-specific configuration settings.',
  })
  @ApiResponse({
    status: 200,
    description: 'Hotel configuration retrieved successfully',
    type: HotelConfigDto,
  })
  getHotelConfig(): Observable<HotelConfigDto> {
    return this.configurationService.getHotelConfig();
  }

  @Patch()
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
  updateHotelConfig(
    @Body() updateData: UpdateHotelConfigDto,
  ): Observable<HotelConfigDto> {
    return this.configurationService.updateHotelConfig(updateData);
  }
}
