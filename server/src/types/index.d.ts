import { HydratedDocument } from 'mongoose';
import { UserDocument } from '../models/user';
import { Request } from 'express';

export {};

declare global {
  namespace Express {
    // export interface User extends (Express.User & HydratedDocument<UserDocument>) {
      // id: string;
    // };
    export interface Request {
      isAuthenticated: () => boolean;
      query: {
        socketId: string;
      };
    }
  }
}
