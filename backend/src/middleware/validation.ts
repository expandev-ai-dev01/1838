import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { errorResponse } from './crud';

export function validationMiddleware(schema: z.ZodSchema) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (error) {
      res.status(400).json(errorResponse('Validation failed', 'VALIDATION_ERROR'));
    }
  };
}
