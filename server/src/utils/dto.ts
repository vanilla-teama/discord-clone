import { HydratedDocument } from 'mongoose';
import { UserDocument } from '../models/user';
import { DTOChat, DTOUser, DTOPersonalMessage, DTOChannelMessage, DTOChannel } from '../types/dto';
import { PersonalMessageDocument } from '../models/personal-message';
import { ChannelDocument } from '../models/channel';
import { ChannelMessageDocument } from '../models/channel-message';

export type FetchedUser = HydratedDocument<UserDocument, {}, { chats: DTOChat[] }>;

export type FetchedChat = HydratedDocument<Pick<UserDocument, 'name' | 'availability' | 'createdAt'>>;

export type FetchedPersonalMessage = HydratedDocument<PersonalMessageDocument>;

export type FetchedChannelMessage = HydratedDocument<ChannelMessageDocument>;

export type FetchedChannel = HydratedDocument<ChannelDocument>;

export const userDTO = ({
  _id,
  email,
  name,
  password,
  phone,
  availability,
  chats,
  invitesFrom,
  invitesTo,
  friends,
  createdAt,
  invitesToChannels,
  joinedChannels,
}: FetchedUser): DTOUser => {
  return {
    id: _id.toString(),
    name,
    email,
    password: '',
    phone,
    availability,
    chats: chats as unknown as DTOChat[],
    friends: (friends || []).map((id) => id.toString()),
    invitesFrom: (invitesFrom || []).map((id) => id.toString()),
    invitesTo: (invitesTo || []).map((id) => id.toString()),
    invitesToChannels: invitesToChannels as unknown as DTOChannel[] || [],
    joinedChannels: joinedChannels as unknown as DTOChannel[] || [],
    createdAt,
  };
};

export const chatDTO = ({ _id, name, availability, createdAt }: FetchedChat): DTOChat => ({
  userId: _id.toString(),
  userName: name,
  availability,
  createdAt,
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

export const channelMessageDTO = ({
  _id,
  service,
  userId,
  channelId,
  responsedToMessageId,
  responsedToMessage,
  date,
  message,
}: FetchedChannelMessage): DTOChannelMessage => {
  return {
    id: _id.toString(),
    service,
    userId: userId.toString(),
    channelId: channelId.toString(),
    responsedToMessageId: responsedToMessageId ? responsedToMessageId.toString() : null,
    date,
    message,
    responsedToMessage: responsedToMessage ? channelMessageDTO(responsedToMessage as FetchedChannelMessage) : null,
  };
};

export const channelDTO = ({ _id, name, serverId }: FetchedChannel): DTOChannel => {
  return {
    id: _id.toString(),
    name,
    serverId: serverId.toString(),
  };
};
