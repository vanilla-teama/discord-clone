import { Availability } from './entities';

export interface ServerToClientEvents {
  noArg: () => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
  id: (id: string) => void;
  removeClient: (id: string) => void;
  userChangedAvailability: (data: { availability: Availability; userId: string }) => void;
  userLoggedOut: (userId: string) => void;
  personalMessage: (data: { fromUserId: string; toUserId: string }) => void;
  personalMessageUpdated: (data: { messageId: string }) => void;
  personalMessageDeleted: (data: { messageId: string }) => void;
  userInvited: (data: { userId: string }) => void;
}

export interface ClientToServerEvents {
  userLoggedIn: (data: { userId: string }) => void;
  userLoggedOut: (data: { userId: string }) => void;
  personalMessage: (data: { fromUserId: string; toUserId: string }) => void;
  personalMessageUpdated: (data: { messageId: string }) => void;
  personalMessageDeleted: (data: { messageId: string }) => void;
  userInvited: (data: { userId: string }) => void;
  run: () => void;
}
