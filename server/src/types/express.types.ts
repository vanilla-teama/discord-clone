import { Query } from 'express-serve-static-core';
import { Request } from 'express';
import { HydratedDocument } from 'mongoose';
import { UserDocument } from '../models/user';

export interface TypedRequest<
  Q extends Query = {},
  B extends Request['body'] = {},
  // U extends Express.User = Express.User
> extends Request {
  query: { socketId: string } & Q;
  body: B;
  // user: U;
}
