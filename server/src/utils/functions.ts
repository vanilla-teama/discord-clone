import { NextFunction } from 'express';
import { Document, HydratedDocument } from 'mongoose';
import { UserDocument } from '../models/user';

export interface RequestError extends Error {
  statusCode: number;
}

export const requestErrorHandler =
  (err: RequestError, next: NextFunction) =>
  (statusCode = 500, message?: string): void => {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    if (message) {
      err.message = message;
    }
    console.error(err);
    next(err);
  };

export const handleDocumentNotFound = <T extends Document>(
  user: T | null | undefined
): user is T => {
  if (user) {
    return true;
  }
  const error = Object.assign(new Error('Could not find user.'), {
    statusCode: 404,
  });
  console.log(error);
  return false;
};
