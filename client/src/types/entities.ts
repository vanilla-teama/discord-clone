export type MongoObjectId = string;
export type Timestamp = number;

export interface MongoEntity {
  id: MongoObjectId;
}

export interface User extends MongoEntity {
  name: string;
  password: string;
  email: string;
  phone: string;
  availability: Availability;
  chats: Chat[] | null;
}

export interface FetchedUser {
  _id: string;
  name: string;
  password: string;
  email: string;
  phone: string;
  friends: string[];
}

export interface PersonalMessage extends MongoEntity {
  fromUserId: MongoObjectId;
  toUserId: MongoObjectId;
  responseMessageId: MongoObjectId | null;
  date: Timestamp;
  message: string;
}

export interface ChannelMessage extends MongoEntity {
  responseMessageId: MongoObjectId;
  date: Timestamp;
  message: string;
}

export interface Server<S extends 'data' | 'formData' = 'data'> extends MongoEntity {
  name: string;
  image: S extends 'formData' ? File : string | null;
}

export interface Chat extends MongoEntity {
  userId: MongoObjectId;
  userName: string;
  availability: Availability;
}

export enum Availability {
  Online = 'online',
  Offline = 'offline',
  Away = 'away',
  DoNotDisturb = 'donotdisturb',
}

export type ChatAvailabilitiesMap = Map<Chat, Availability>;
