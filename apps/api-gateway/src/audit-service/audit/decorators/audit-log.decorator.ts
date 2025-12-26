import { SetMetadata } from '@nestjs/common';
import { AuditLogOptions } from '@app/contracts/audit-service';

export const AUDIT_LOG_KEY = 'audit_log';

export const AuditLog = (options: AuditLogOptions) =>
  SetMetadata(AUDIT_LOG_KEY, options);
