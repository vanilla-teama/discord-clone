import { Socket } from 'socket.io';
import { Availability } from '../models/user';

export type AppSocket = Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;

export interface ServerToClientEvents {
  noArg: () => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
  id: (id: string) => void;
  removeClient: (id: string) => void;
  userChangedAvailability: (data: { userId: string }) => void;
  userLoggedOut: (userId: string) => void;
  personalMessage: (data: { fromUserId: string; toUserId: string }) => void;
  personalMessageUpdated: (data: { messageId: string }) => void;
  personalMessageDeleted: (data: { messageId: string }) => void;
  userInvitedToFriends: (data: { userId: string }) => void;
  userAddedToFriends: (data: { userId: string; friendId: string }) => void;
  friendInvitationCanceled: (data: { userId: string; friendId: string }) => void;
  friendDeleted: (data: { userId: string; friendId: string }) => void;
}

export interface ClientToServerEvents {
  userLoggedIn: (data: { userId: string }) => void;
  userLoggedOut: (data: { userId: string }) => void;
  personalMessage: (data: { fromUserId: string; toUserId: string }) => void;
  personalMessageUpdated: (data: { messageId: string }) => void;
  personalMessageDeleted: (data: { messageId: string }) => void;
  userInvitedToFriends: (data: { userId: string }) => void;
  userAddedToFriends: (data: { userId: string; friendId: string }) => void;
  friendInvitationCanceled: (data: { userId: string; friendId: string }) => void;
  friendDeleted: (data: { userId: string; friendId: string }) => void;
  run: () => void;
}

export interface InterServerEvents {
  ping: () => void;
  userLoggedIn: (data: { userId: string }) => void;
  userLoggedOut: (data: { userId: string }) => void;
}

export interface SocketData {
  name: string;
  age: number;
}
