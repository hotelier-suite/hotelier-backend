import { SetMetadata } from '@nestjs/common';
import { AuditAction, AuditResource } from '@app/contracts/audit-service/enums';

export interface AuditLogOptions {
  action?: AuditAction;
  resource?: AuditResource;
  description?: string;
  resourceIdParam?: string;
  includeBody?: boolean;
  includeResult?: boolean;
}

export const AUDIT_LOG_KEY = 'audit_log';

export const AuditLog = (options: AuditLogOptions) =>
  SetMetadata(AUDIT_LOG_KEY, options);
