import { io } from 'socket.io-client';

type UserLoggedInOutDataClient = {
  id: string;
};

type UserLoggedInOutDataServer = {
  id: string;
};

export type SocketClientEvents = {
  userLoggedInClient: {
    data: UserLoggedInOutDataClient;
  };
  userLoggedOutClient: {
    data: UserLoggedInOutDataClient;
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
};

export type ValueOfSocketEvent<T extends SocketClientEventName> = T extends 'userLoggedInClient'
  ? SocketClientEvents['userLoggedInClient']
  : T extends 'userLoggedOutClient'
  ? SocketClientEvents['userLoggedOutClient']
  : never;

export type SocketClientEventName = keyof SocketClientEvents;
export type SocketServerEventName = keyof SocketServerEvents;

export const createSocketEvent = (name: SocketClientEventName, data: ValueOfSocketEvent<typeof name>) => ({
  name,
  data,
});

const socket = io();

export const bindSocketEvent = (
  event: SocketClientEventName | SocketServerEventName,
  handler: (...args: unknown[]) => void
): void => {
  socket.on(event, handler);
};

export const bindGlobalSocketEvents = () => {
  bindSocketEvent('connect', () => {
    console.log('connect');
  });

  bindSocketEvent('disconnect', (message: unknown) => {
    console.log('disconnect ' + message);
  });

  bindSocketEvent('id', (id: unknown) => {
    console.log('socket id', id);
  });

  bindSocketEvent('client', (clients: unknown) => {
    console.log('on clients', clients);
  });
};

export default socket;
