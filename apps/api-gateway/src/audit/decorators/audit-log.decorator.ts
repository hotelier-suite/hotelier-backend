import { SetMetadata } from '@nestjs/common';
import { AuditAction } from '../enums/audit-action.enum';
import { AuditResource } from '../enums/audit-resource.enum';

export interface AuditLogOptions {
  action?: AuditAction; // Optional to allow class-level without explicit action
  resource?: AuditResource; // Optional for flexibility; prefer setting at class-level
  description?: string;
  resourceIdParam?: string; // Name of parameter containing resource ID
  includeBody?: boolean; // Whether to include request body in details
  includeResult?: boolean; // Whether to include response in details
}

export const AUDIT_LOG_KEY = 'audit_log';

export const AuditLog = (options: AuditLogOptions) =>
  SetMetadata(AUDIT_LOG_KEY, options);
