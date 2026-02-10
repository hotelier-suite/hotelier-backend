import { AuditLogDto } from '../dto/audit-log.dto';

export interface AuditLogWithUser extends AuditLogDto {
  user?: {
    id: number;
    name: string;
    email: string;
  };
}
