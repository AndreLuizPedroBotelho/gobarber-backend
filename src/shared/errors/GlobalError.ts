import { NextFunction, Response, Request } from 'express';
import AppError from './AppError';

export default function GlobalError(
  err: Error,
  request: Request,
  response: Response,
  _: NextFunction
): any {
  if (err instanceof AppError) {
    return response.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  console.log(err);
  return response.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
}
