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
  invitesToChannels: string[],
  createdAt: Date;
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
  userId: string;
  channelId: string;
  responsedToMessageId: string | null;
  date: Date;
  message: string;
  responsedToMessage: DTOChannelMessage | null;
}

export interface DTOServer extends DTOEntity {
  name: string;
  image: string;
}

export interface DTOChannel extends DTOEntity {
  name: string;
  serverId: string;
}

export interface DTOChat {
  userId: string;
  userName: string;
  availability: string;
  createdAt: Date;
}
