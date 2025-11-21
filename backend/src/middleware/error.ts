import { Request, Response, NextFunction } from 'express';
import { errorResponse, StatusGeneralError } from './crud';

export function errorMiddleware(error: any, req: Request, res: Response, next: NextFunction) {
  console.error('Error:', error);

  if (error.name === 'ZodError') {
    return res.status(400).json(errorResponse('Validation Error', 'VALIDATION_ERROR'));
  }

  const statusCode = error.statusCode || StatusGeneralError;
  const message = error.message || 'Internal Server Error';

  res.status(statusCode).json(errorResponse(message));
}
