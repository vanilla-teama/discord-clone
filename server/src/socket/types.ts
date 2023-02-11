import { Socket } from 'socket.io';
import { Availability } from '../models/user';

export type AppSocket = Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;

export interface ServerToClientEvents {
  noArg: () => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
  id: (id: string) => void;
  removeClient: (id: string) => void;
  userChangedAvailability: (data: { availability: Availability; userId: string }) => void;
  personalMessage: (data: { fromUserId: string; toUserId: string }) => void;
}

export interface ClientToServerEvents {
  userLoggedIn: (data: { userId: string }) => void;
  personalMessage: (data: { fromUserId: string; toUserId: string }) => void;
  run: () => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  name: string;
  age: number;
}
