export type MongoEntityId = string;
export type Timestamp = number;

export interface MongoEntity {
  id: MongoEntityId;
}

export interface User extends MongoEntity {
  name: string;
  password: string;
  email: string;
  phone: string;
}

export interface PersonalMessage extends MongoEntity {
  fromUserId: MongoEntityId;
  toUserId: MongoEntityId;
  responseMessageId: MongoEntityId | null;
  date: Timestamp;
  message: string;
}

export interface ChannelMessage extends MongoEntity {
  responseMessageId: MongoEntityId;
  date: Timestamp;
  message: string;
}

export interface Server extends MongoEntity {
  name: string;
  avatar: string;
}
