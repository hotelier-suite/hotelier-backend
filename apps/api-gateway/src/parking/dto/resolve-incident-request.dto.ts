import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class ResolveIncidentRequestDto {
  @ApiProperty({
    description: 'Resolution details for the incident',
    example: 'Incident documented, vehicle owner notified, insurance contacted',
  })
  @IsString()
  @Length(1, 1000)
  resolution: string;
}
