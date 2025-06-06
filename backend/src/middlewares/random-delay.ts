import { Request, Response, NextFunction } from 'express';

/**
 * Middleware that adds a random natural delay (100-1000ms) to each response.
 * This simulates network latency for development/testing purposes.
 */
export function randomDelayMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const min = 9000; // ms
  const max = 10000; // ms
  const delay = Math.floor(Math.random() * (max - min + 1)) + min;
  setTimeout(next, delay);
}
