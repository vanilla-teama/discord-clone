import { HydratedDocument } from 'mongoose';
import { UserDocument } from '../models/user';
import { DTOChat, DTOUser, DTOPersonalMessage, DTOChannel } from '../types/dto';
import { PersonalMessageDocument } from '../models/personal-message';
import { ChannelDocument } from '../models/channel';

export type FetchedUser = HydratedDocument<UserDocument, {}, { chats: DTOChat[] }>;

export type FetchedChat = HydratedDocument<Pick<UserDocument, 'name' | 'availability'>>;

export type FetchedPersonalMessage = HydratedDocument<PersonalMessageDocument>;

export type FetchedChannel = HydratedDocument<ChannelDocument>;

export const userDTO = ({ _id, email, name, password, phone, availability, chats, invites }: FetchedUser): DTOUser => {
  return {
    id: _id.toString(),
    name,
    email,
    // password,
    phone,
    availability,
    chats: chats as unknown as DTOChat[],
    invites: (invites || []).map((id) => id.toString()),
  };
};

export const chatDTO = ({ _id, name, availability }: FetchedChat): DTOChat => ({
  userId: _id.toString(),
  userName: name,
  availability,
});

export const personalMessageDTO = ({
  _id,
  fromUserId,
  toUserId,
  responsedToMessageId,
  responsedToMessage,
  date,
  message,
}: FetchedPersonalMessage): DTOPersonalMessage => {
  return {
    id: _id.toString(),
    fromUserId: fromUserId.toString(),
    toUserId: toUserId.toString(),
    responsedToMessageId: responsedToMessageId ? responsedToMessageId.toString() : null,
    date,
    message,
    responsedToMessage: responsedToMessage ? personalMessageDTO(responsedToMessage as FetchedPersonalMessage) : null,
  };
};

export const channelDTO = ({ _id, name, serverId }: FetchedChannel): DTOChannel => {
  return {
    id: _id.toString(),
    name,
    serverId: serverId.toString(),
  };
};
