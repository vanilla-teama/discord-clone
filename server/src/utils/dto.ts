import { HydratedDocument } from 'mongoose';
import { UserDocument } from '../models/user';
import { DTOChat, DTOUser } from '../types/dto';

export type FetchedUser = HydratedDocument<UserDocument>;

export type FetchedChat = HydratedDocument<Pick<UserDocument, 'name'>>;

export const userDTO = ({ _id, email, name, password, phone, availability }: FetchedUser): DTOUser => ({
  id: _id.toString(),
  name,
  email,
  // password,
  phone,
  availability,
});

export const chatDTO = ({ _id, name }: FetchedChat): DTOChat => ({
  userId: _id.toString(),
  userName: name
});
