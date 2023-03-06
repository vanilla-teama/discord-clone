import { HydratedDocument } from 'mongoose';
import { UserDocument } from '../models/user';
import { DTOChat, DTOUser, DTOPersonalMessage, DTOChannelMessage, DTOChannel, DTOChannelInvite, DTOServer } from '../types/dto';
import { PersonalMessageDocument } from '../models/personal-message';
import { ChannelDocument } from '../models/channel';
import { ChannelMessageDocument } from '../models/channel-message';
import { ChannelInviteDocument } from '../models/channel-invite';
import { ServerDocument } from '../models/server';

export type FetchedUser = HydratedDocument<UserDocument, {}, { chats: DTOChat[] }>;

export type FetchedChat = HydratedDocument<Pick<UserDocument, 'name' | 'availability' | 'createdAt'>>;

export type FetchedPersonalMessage = HydratedDocument<PersonalMessageDocument>;

export type FetchedChannelMessage = HydratedDocument<ChannelMessageDocument>;

export type FetchedServer = HydratedDocument<ServerDocument>;

export type FetchedChannel = HydratedDocument<ChannelDocument>;

export type FetchedChannelInvite = HydratedDocument<ChannelInviteDocument>;

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
  profile,
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
    invitesToChannels: invitesToChannels.map((invite) => {
      const channel = invite as unknown as FetchedChannel;
      return {
        id: channel?._id?.toString(),
        name: channel?.name,
        serverId: channel?.serverId?.toString(),
        general: channel?.general || false,
      }
    }),
    joinedChannels: (joinedChannels || []) as unknown as DTOChannel[],
    createdAt,
    profile: {
      avatar: profile.avatar ? profile.avatar.toString('base64') : null,
      about: profile.about ?? null,
      banner: profile.banner ?? null,
    }
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
}: FetchedPersonalMessage): DTOPersonalMessage | null => {
  if (!fromUserId) {
    return null;
  }
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
}: FetchedChannelMessage): DTOChannelMessage | null => {
  if (!userId) {
    return null;
  }
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

export const serverDTO = ({_id, image, name, owner}: FetchedServer): DTOServer => {
  const ownerUser = owner as unknown as FetchedUser;

  return {
    id: _id.toString(),
    name: name,
    image: image,
    owner: owner ? { id: ownerUser._id.toString(), name: ownerUser.name } : null,
  }
}

export const channelDTO = ({ _id, name, serverId, general }: FetchedChannel): DTOChannel => {
  return {
    id: _id.toString(),
    name,
    serverId: serverId.toString(),
    general: general || false,
  };
};

export const channelInviteDTO = ({_id, userId, channelId, date, message, status, messageId }: FetchedChannelInvite): DTOChannelInvite => {
  return {
    id: _id.toString(),
    userId: userId.toString(),
    channelId: channelId.toString(),
    messageId: messageId.toString(),
    date,
    message,
    status,
  }
}
