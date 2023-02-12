import { HydratedDocument } from 'mongoose';
import { UserDocument } from '../models/user';
import { DTOChat, DTOUser, DTOPersonalMessage } from '../types/dto';
import { PersonalMessageDocument } from '../models/personal-message';

export type FetchedUser = HydratedDocument<UserDocument, {}, { chats: DTOChat[] }>;

export type FetchedChat = HydratedDocument<Pick<UserDocument, 'name' | 'availability'>>;

export type FetchedPersonalMessage = HydratedDocument<PersonalMessageDocument>;

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

export const personalMessageDTO = ({ _id, fromUserId, toUserId, responsedMessageId, date, message }: FetchedPersonalMessage): DTOPersonalMessage => ({
  id: _id.toString(),
  fromUserId: fromUserId.toString(),
  toUserId: toUserId.toString(),
  responseMessageId: responsedMessageId ? responsedMessageId.toString() : null,
  date,
  message,
});
