import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { AuditService } from '../audit.service';
import { AuditAction } from '../enums/audit-action.enum';
import { AuditResource } from '../enums/audit-resource.enum';
import { AUDIT_LOG_KEY } from '../decorators/audit-log.decorator';

interface RequestUser {
  sub?: number;
  id?: number;
  [key: string]: unknown;
}

interface AuditLogOptions {
  action?: AuditAction;
  resource?: AuditResource;
  description?: string;
  resourceIdParam?: string;
  includeBody?: boolean;
  includeResult?: boolean;
}

@Injectable()
export class AuditLogInterceptor implements NestInterceptor {
  constructor(
    private readonly auditService: AuditService,
    private readonly reflector: Reflector,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // Allow method-level or class-level options
    const handlerOptions = this.reflector.get<AuditLogOptions>(
      AUDIT_LOG_KEY,
      context.getHandler(),
    );
    const classOptions = this.reflector.get<AuditLogOptions>(
      AUDIT_LOG_KEY,
      context.getClass(),
    );
    const auditOptions: AuditLogOptions | undefined =
      handlerOptions || classOptions;

    if (!auditOptions) {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user as RequestUser;
    const userIdFromRequest: number | undefined = user?.sub ?? user?.id;

    const startTime = Date.now();

    return next.handle().pipe(
      tap((result) => {
        this.logAuditEntry(
          auditOptions,
          request,
          userIdFromRequest,
          result,
          true,
          Date.now() - startTime,
        ).catch((error: Error) => {
          console.error('Failed to log audit entry:', error.message);
        });
      }),
      catchError((error: Error) => {
        this.logAuditEntry(
          auditOptions,
          request,
          userIdFromRequest,
          error.message,
          false,
          Date.now() - startTime,
        ).catch((auditError: Error) => {
          console.error(
            'Failed to log audit entry for error:',
            auditError.message,
          );
        });
        throw error;
      }),
    );
  }

  private async logAuditEntry(
    options: AuditLogOptions,
    request: Request,
    userId: number | undefined,
    result: any,
    success: boolean,
    duration: number,
  ): Promise<void> {
    const resourceId = options.resourceIdParam
      ? request.params[options.resourceIdParam]
      : undefined;
    // Derive action from HTTP method when not specified
    const action = options.action ?? this.mapMethodToAction(request.method);
    const resource = options.resource ?? 'OTHER';

    const details: Record<string, any> = {
      method: request.method,
      url: request.url,
      success,
      duration,
    };

    if (options.includeBody && request.body) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      details.requestBody = this.sanitizeData(request.body);
    }

    if (options.includeResult && result && success) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      details.response = this.sanitizeData(result);
    }

    const description =
      options.description ||
      this.generateDescription(action, String(resource), success);

    let effectiveUserId: number | undefined = userId;
    if (
      effectiveUserId === undefined &&
      result &&
      typeof result === 'object' &&
      'user' in result
    ) {
      const maybeUser = (result as { user?: { id?: unknown } }).user;
      if (maybeUser && typeof maybeUser.id === 'number') {
        effectiveUserId = maybeUser.id;
      }
    }

    if (!effectiveUserId) {
      return; // Cannot log without a userId due to schema constraints
    }

    await this.auditService.log({
      userId: effectiveUserId,
      action,
      resource: resource as unknown as AuditResource,
      resourceId,
      description,
      details,
      userAgent: request.headers['user-agent'] as string,
    });
  }

  private sanitizeData(data: any): any {
    if (!data || typeof data !== 'object') {
      return data;
    }

    const sensitiveFields = [
      'password',
      'token',
      'accessToken',
      'refreshToken',
      'secret',
      'key',
      'authorization',
      'cookie',
      'session',
    ];

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const sanitized: Record<string, any> = { ...data };

    for (const field of sensitiveFields) {
      if (field in sanitized) {
        sanitized[field] = '[REDACTED]';
      }
    }

    return sanitized;
  }

  private generateDescription(
    action: AuditAction,
    resource: string,
    success: boolean,
  ): string {
    const status = success ? 'Successful action:' : 'Failed action:';
    const verb = this.getActionVerb(action);
    const resourceName = resource.toLowerCase().replace('_', ' ');

    return `${status} ${verb} ${resourceName}`;
  }

  private getActionVerb(action: AuditAction): string {
    switch (action) {
      case AuditAction.CREATE:
        return 'created';
      case AuditAction.READ:
        return 'viewed';
      case AuditAction.UPDATE:
        return 'updated';
      case AuditAction.DELETE:
        return 'deleted';
      case AuditAction.LOGIN:
        return 'logged in';
      case AuditAction.LOGOUT:
        return 'logged out';
      default:
        return action.toLowerCase();
    }
  }

  private mapMethodToAction(method: string): AuditAction {
    switch (method.toUpperCase()) {
      case 'POST':
        return AuditAction.CREATE;
      case 'GET':
        return AuditAction.READ;
      case 'PUT':
      case 'PATCH':
        return AuditAction.UPDATE;
      case 'DELETE':
        return AuditAction.DELETE;
      default:
        return AuditAction.CUSTOM;
    }
  }
}
