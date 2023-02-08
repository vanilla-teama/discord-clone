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

export interface Chat {
  userId: MongoObjectId;
  userName: string;
}
