import { Logger } from '@nestjs/common';
import { NextFunction, Request, RequestHandler, Response } from 'express';
import { randomUUID } from 'node:crypto';
import { AppRequest } from '../types/AppRequest';

const REQUEST_ID_PATTERN = /^[A-Za-z0-9._-]{8,64}$/;
const REQUEST_ID_HEADER = 'X-Request-ID';
const CORRELATION_ID_HEADER = 'X-Correlation-ID';

export function requestContext(): RequestHandler {
  const logger = new Logger('HTTP');

  return (req: Request, res: Response, next: NextFunction): void => {
    const request = req as AppRequest;
    const inboundRequestId =
      request.headers[REQUEST_ID_HEADER.toLowerCase()] ||
      request.headers[REQUEST_ID_HEADER];
    const inboundCorrelationId =
      request.headers[CORRELATION_ID_HEADER.toLowerCase()] ||
      request.headers[CORRELATION_ID_HEADER];

    const requestId =
      typeof inboundRequestId === 'string' &&
      REQUEST_ID_PATTERN.test(inboundRequestId)
        ? inboundRequestId
        : randomUUID();
    const correlationId =
      typeof inboundCorrelationId === 'string'
        ? inboundCorrelationId
        : requestId;
    request.id = requestId;
    request.correlationId = correlationId;

    res.setHeader(REQUEST_ID_HEADER, requestId);
    res.setHeader(CORRELATION_ID_HEADER, correlationId);

    const startedAt = process.hrtime.bigint();
    res.on('finish', () => {
      const path = req.originalUrl.split('?')[0] ?? req.url;
      const durationMs = Number(process.hrtime.bigint() - startedAt) / 1e6;

      logger.log({
        message: 'Request completed',
        requestId,
        correlationId,
        method: request.method,
        path,
        statusCode: res.statusCode,
        durationMss: Math.round(durationMs * 10) / 10,
      });
    });

    next();
  };
}
