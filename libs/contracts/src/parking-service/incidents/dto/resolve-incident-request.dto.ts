import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class ResolveIncidentRequestDto {
  @ApiProperty({
    example: 'Incident documented, vehicle owner notified, insurance contacted',
  })
  @IsString()
  @Length(1, 1000)
  resolution: string;
}
