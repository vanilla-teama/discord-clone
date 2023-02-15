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
  friends: MongoObjectId[];
  invitesFrom: MongoObjectId[];
  invitesTo: MongoObjectId[];
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
  responsedToMessageId: MongoObjectId | null;
  date: Timestamp;
  message: string;
  responsedToMessage: PersonalMessage | null;
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
export interface Channel extends MongoEntity {
  serverId: MongoObjectId;
  name: string;
}

export enum Availability {
  Online = 'online',
  Offline = 'offline',
  Away = 'away',
  DoNotDisturb = 'donotdisturb',
}

export type ChatAvailabilitiesMap = Map<Chat, Availability>;
