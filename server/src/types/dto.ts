import { ChannelInviteStatus } from "../models/channel-invite";
import { Availability } from "../models/user";

interface DTOEntity {
  id: string;
}

export interface DTOUser extends DTOEntity {
  name: string;
  password: string;
  email: string;
  phone: string;
  availability: Availability;
  chats: DTOChat[];
  friends: string[];
  invitesFrom: string[];
  invitesTo: string[];
  invitesToChannels: DTOChannel[],
  joinedChannels: DTOChannel[],
  createdAt: Date;
  profile: {
    avatar: string | null;
    about: string | null;
    banner: string | null;
  }
}

export interface DTOPersonalMessage extends DTOEntity {
  fromUserId: string;
  toUserId: string;
  responsedToMessageId: string | null;
  date: Date;
  message: string;
  responsedToMessage: DTOPersonalMessage | null;
}

export interface DTOChannelMessage extends DTOEntity {
  service: boolean;
  userId: string;
  channelId: string;
  responsedToMessageId: string | null;
  date: Date;
  message: string;
  responsedToMessage: DTOChannelMessage | null;
}

export interface DTOServer extends DTOEntity {
  name: string;
  image: string | null;
  owner: {
    id: string;
    name: string;
  } | null
}

export interface DTOChannel extends DTOEntity {
  name: string;
  serverId: string;
  general: boolean;
}

export interface DTOChannelInvite extends DTOEntity {
  userId: string;
  channelId: string;
  messageId: string;
  date: Date;
  message: string;
  status: ChannelInviteStatus;
}

export interface DTOChat {
  userId: string;
  userName: string;
  availability: string;
  createdAt: Date;
}
