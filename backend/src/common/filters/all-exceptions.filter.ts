import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    private readonly logger = new Logger(AllExceptionsFilter.name);

    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        const status =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        // Extract the message for known HTTP exceptions
        let errorBody: string | object;
        if (exception instanceof HttpException) {
            const exResponse = exception.getResponse();
            errorBody = typeof exResponse === 'string'
                ? { message: exResponse }
                : exResponse;
        } else {
            // Never leak internal error details to clients
            errorBody = { message: 'Internal server error' };
        }

        // Log the full error internally (including stack trace for 5xx)
        if (status >= 500) {
            this.logger.error(
                `[${request.method}] ${request.url} - Status: ${status}`,
                exception instanceof Error ? exception.stack : String(exception),
            );
        } else {
            this.logger.warn(`[${request.method}] ${request.url} - Status: ${status} - ${JSON.stringify(errorBody)}`);
        }

        response.status(status).json({
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            ...(typeof errorBody === 'object' ? errorBody : { message: errorBody }),
        });
    }
}
