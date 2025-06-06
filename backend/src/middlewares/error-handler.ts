import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/app-error';


export function errorHandler(err: unknown, req: Request, res: Response, next: NextFunction) {
  if (res.headersSent) {
    return next(err);
  }

  if (err instanceof AppError) {
    res
      .status(err.statusCode)
      .json({ error: err.message });

    return;
  }

  console.error('Unexpected error:', err);

  res
    .status(500)
    .json({ error: 'Something went wrong on the server!' });
}