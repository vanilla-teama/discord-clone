import { Availability } from "../models/user";

interface DTOEntity {
  id: string;
}

export interface DTOUser extends DTOEntity {
  name: string;
  // password: string;
  email: string;
  phone: string;
  availability: Availability;
}

export interface DTOPersonalMessage extends DTOEntity {
  fromUserId: string;
  toUserId: string;
  responseMessageId: string | null;
  date: Date;
  message: string;
}

export interface DTOChannelMessage extends DTOEntity {
  responseMessageId: string;
  date: Date;
  message: string;
}

export interface DTOServer extends DTOEntity {
  name: string;
  avatar: string;
}

export interface DTOChat {
  userId: string;
  userName: string;
}
