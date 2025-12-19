import {
  CallHandler,
  ExecutionContext,
  HttpException,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class RpcToHttpExceptionInterceptor implements NestInterceptor {
  intercept(
    _context: ExecutionContext,
    next: CallHandler,
  ): Observable<unknown> {
    return next.handle().pipe(
      catchError((err: unknown) => {
        if (err instanceof HttpException) {
          return throwError(() => err);
        }

        const { statusCode, message } = this.extractStatusAndMessage(err);
        return throwError(() => new HttpException(message, statusCode));
      }),
    );
  }

  private extractStatusAndMessage(err: unknown): {
    statusCode: number;
    message: string;
  } {
    const fallback = { statusCode: 500, message: 'Internal server error' };

    if (typeof err === 'string') {
      return { statusCode: 500, message: err };
    }

    if (!err || typeof err !== 'object') {
      return fallback;
    }

    const raw = err as Record<string, unknown>;

    if (typeof raw.statusCode === 'number' && typeof raw.message === 'string') {
      return { statusCode: raw.statusCode, message: raw.message };
    }

    if (raw.message && typeof raw.message === 'object') {
      const nested = raw.message as Record<string, unknown>;
      if (
        typeof nested.statusCode === 'number' &&
        typeof nested.message === 'string'
      ) {
        return { statusCode: nested.statusCode, message: nested.message };
      }

      if (typeof nested.message === 'string') {
        return {
          statusCode:
            typeof nested.statusCode === 'number' ? nested.statusCode : 500,
          message: nested.message,
        };
      }
    }

    if (typeof raw.message === 'string') {
      return {
        statusCode: typeof raw.statusCode === 'number' ? raw.statusCode : 500,
        message: raw.message,
      };
    }

    if (typeof raw.error === 'string') {
      return { statusCode: 500, message: raw.error };
    }

    return fallback;
  }
}
