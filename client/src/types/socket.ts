import { Availability } from './entities';

export interface ServerToClientEvents {
  noArg: () => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
  id: (id: string) => void;
  removeClient: (id: string) => void;
  userRegistered: (data: { userId: string }) => void;
  userChangedAvailability: (data: { availability: Availability; userId: string }) => void;
  userLoggedOut: (userId: string) => void;
  personalMessage: (data: { fromUserId: string; toUserId: string }) => void;
  personalMessageUpdated: (data: { messageId: string }) => void;
  personalMessageDeleted: (data: { messageId: string }) => void;
  channelMessage: (data: { userId: string; channelId: string }) => void;
  channelMessageUpdated: (data: { messageId: string }) => void;
  channelMessageDeleted: (data: { messageId: string }) => void;
  userInvitedToFriends: (data: { userId: string }) => void;
  userAddedToFriends: (data: { userId: string; friendId: string }) => void;
  friendInvitationCanceled: (data: { userId: string; friendId: string }) => void;
  friendDeleted: (data: { userId: string; friendId: string }) => void;
  userInvitedToChannel: (data: { userId: string; channelId: string }) => void;
  serverAdded: (data: { serverId: string; userId: string }) => void;
  accountUpdated: (data: { userId: string }) => void;
}

export interface ClientToServerEvents {
  userRegistered: (data: { userId: string }) => void;
  userLoggedIn: (data: { userId: string }) => void;
  userLoggedOut: (data: { userId: string }) => void;
  personalMessage: (data: { fromUserId: string; toUserId: string }) => void;
  personalMessageUpdated: (data: { messageId: string }) => void;
  personalMessageDeleted: (data: { messageId: string }) => void;
  channelMessage: (data: { userId: string; channelId: string }) => void;
  channelMessageUpdated: (data: { messageId: string }) => void;
  channelMessageDeleted: (data: { messageId: string }) => void;
  userInvitedToFriends: (data: { userId: string }) => void;
  userAddedToFriends: (data: { userId: string; friendId: string }) => void;
  friendInvitationCanceled: (data: { userId: string; friendId: string }) => void;
  friendDeleted: (data: { userId: string; friendId: string }) => void;
  userInvitedToChannel: (data: { userId: string; channelId: string }) => void;
  serverAdded: (data: { serverId: string; userId: string }) => void;
  accountUpdated: (data: { userId: string }) => void;
  run: () => void;
}
