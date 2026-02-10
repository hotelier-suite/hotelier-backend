import { AuditAction, AuditResource } from '../enums';

export interface AuditLogParams {
  userId: number;
  action: AuditAction;
  resource: AuditResource;
  description: string;
  resourceId?: string;
  details?: Record<string, unknown>;
  userAgent?: string;
}
