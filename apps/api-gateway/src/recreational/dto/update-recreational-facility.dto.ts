import { PartialType } from '@nestjs/swagger';
import { CreateRecreationalFacilityDto } from './create-recreational-facility.dto';

export class UpdateRecreationalFacilityDto extends PartialType(
  CreateRecreationalFacilityDto,
) {}
