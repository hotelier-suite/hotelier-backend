import { Controller, Get, Put, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuditLog } from '../../audit/decorators/audit-log.decorator';
import { AuditResource } from '../../audit/enums/audit-resource.enum';
import { HotelConfigDto } from '@app/contracts/config-service/configuration/dto/hotel-config.dto';
import { UpdateHotelConfigDto } from '@app/contracts/config-service/configuration/dto/update-hotel-config.dto';
import { Observable } from 'rxjs';
import { ConfigurationService } from './configuration.service';

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
  getHotelConfig(): Observable<HotelConfigDto> {
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
  updateHotelConfig(
    @Body() updateData: UpdateHotelConfigDto,
  ): Observable<HotelConfigDto> {
    return this.configurationService.updateHotelConfig(updateData);
  }
}
