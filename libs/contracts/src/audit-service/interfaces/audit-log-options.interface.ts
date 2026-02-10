import { AuditAction, AuditResource } from '../enums';

export interface AuditLogOptions {
  action?: AuditAction;
  resource?: AuditResource;
  description?: string;
  resourceIdParam?: string;
  includeBody?: boolean;
  includeResult?: boolean;
}
