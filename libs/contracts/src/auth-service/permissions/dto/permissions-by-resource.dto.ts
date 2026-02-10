import { ApiProperty } from '@nestjs/swagger';
import { PermissionResponseDto } from './permission-response.dto';

export class PermissionsByResourceDto {
  @ApiProperty({
    description: 'Permissions grouped by resource type',
    example: {
      RESERVATION: [
        {
          id: 1,
          name: 'reservation:read',
          resource: 'RESERVATION',
          action: 'READ',
        },
        {
          id: 2,
          name: 'reservation:create',
          resource: 'RESERVATION',
          action: 'CREATE',
        },
      ],
      ROOM: [{ id: 3, name: 'room:read', resource: 'ROOM', action: 'READ' }],
    },
    type: 'object',
    additionalProperties: {
      type: 'array',
      items: { $ref: '#/components/schemas/PermissionResponseDto' },
    },
  })
  permissions: Record<string, PermissionResponseDto[]>;
}
