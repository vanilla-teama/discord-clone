import { io } from 'socket.io-client';
import { MongoObjectId } from '../types/entities';
import { IncomingPersonalMessage } from '../store/app-store';

type UserLoggedInOutDataClient = {
  id: string;
};

type UserLoggedInOutDataServer = UserLoggedInOutDataClient;

type PersonalMessageDataClient = {
  fromUserId: MongoObjectId;
  toUserId: MongoObjectId;
};

type PersonalMessageDataServer = PersonalMessageDataClient;

export type SocketClientEvents = {
  userLoggedInClient: {
    data: UserLoggedInOutDataClient;
  };
  userLoggedOutClient: {
    data: UserLoggedInOutDataClient;
  };
  personalMessageClient: {
    data: PersonalMessageDataClient;
  };
};

export type SocketServerEvents = {
  userLoggedInServer: {
    data: UserLoggedInOutDataServer;
  };
  connect: {
    data: unknown;
  };
  disconnect: {
    data: unknown;
  };
  id: {
    data: unknown;
  };
  client: {
    data: unknown;
  };
  personalMessageServer: {
    data: PersonalMessageDataServer;
  };
};

export type ValueOfSocketEvent<T extends SocketClientEventName> = T extends 'userLoggedInClient'
  ? SocketClientEvents['userLoggedInClient']
  : T extends 'userLoggedOutClient'
  ? SocketClientEvents['userLoggedOutClient']
  : T extends 'personalMessageClient'
  ? SocketClientEvents['personalMessageClient']
  : never;

export type SocketClientEventName = keyof SocketClientEvents;
export type SocketServerEventName = keyof SocketServerEvents;

export const createSocketEvent = (name: SocketClientEventName, data: ValueOfSocketEvent<typeof name>) => ({
  name,
  data,
});

const socket = io();

export const bindEvent = (
  event: SocketClientEventName | SocketServerEventName,
  handler: (...args: unknown[]) => void
): void => {
  socket.on(event, handler);
};

export const bindGlobalSocketEvents = () => {
  bindEvent('connect', () => {
    console.log('connect');
  });

  bindEvent('disconnect', (message: unknown) => {
    console.log('disconnect ' + message);
  });

  bindEvent('id', (id: unknown) => {
    console.log('socket id', id);
  });

  bindEvent('client', (clients: unknown) => {
    console.log('on clients', clients);
  });
};

export const emitPersonalMessage = (message: IncomingPersonalMessage) => {
  const event = createSocketEvent('personalMessageClient', {
    data: { fromUserId: message.fromUserId, toUserId: message.toUserId },
  });
  socket.emit(event.name, event.data);
};

export default socket;
