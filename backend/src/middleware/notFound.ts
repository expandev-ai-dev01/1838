import { Request, Response } from 'express';
import { errorResponse } from './crud';

export function notFoundMiddleware(req: Request, res: Response) {
  res.status(404).json(errorResponse('Resource not found', 'NOT_FOUND'));
}
