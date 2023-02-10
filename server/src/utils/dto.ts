import { HydratedDocument } from 'mongoose';
import { UserDocument } from '../models/user';
import { DTOChat, DTOUser } from '../types/dto';

export type FetchedUser = HydratedDocument<UserDocument, {}, { chats: DTOChat[] }>;

export type FetchedChat = HydratedDocument<Pick<UserDocument, 'name' | 'availability'>>;

export const userDTO = ({ _id, email, name, password, phone, availability, chats }: FetchedUser): DTOUser => {
  return {
    id: _id.toString(),
    name,
    email,
    // password,
    phone,
    availability,
    chats: chats as unknown as DTOChat[],
  }
};

export const chatDTO = ({ _id, name, availability }: FetchedChat): DTOChat => ({
  userId: _id.toString(),
  userName: name,
  availability,
});
