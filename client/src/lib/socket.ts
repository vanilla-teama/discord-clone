import { ManagerOptions, io } from 'socket.io-client';
import { MongoObjectId, User } from '../types/entities';
import { IncomingPersonalMessage } from '../store/app-store';
import { FallbackToUntypedListener } from '@socket.io/component-emitter';
import { SocketOptions } from 'engine.io-client';

type UserLoggedInOutDataClient = {
  id: string;
};

type UserLoggedInOutDataServer = {
  user: User;
};

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
  connect_error: {
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

export type SocketClientEventName = keyof SocketClientEvents;
export type SocketServerEventName = keyof SocketServerEvents;

export const createSocketEvent = <K extends SocketClientEventName>(name: K, data: SocketClientEvents[K]) => ({
  name,
  data,
});

export type BindSocketEventName = SocketClientEventName | SocketServerEventName;
export type BindSocketEventHandler<K extends BindSocketEventName> = FallbackToUntypedListener<
  K extends 'connect' | 'disconnect' | 'connect_error'
    ? () => void
    : K extends string
    ? (
        data: K extends SocketClientEventName
          ? SocketClientEvents[K]['data']
          : K extends SocketServerEventName
          ? SocketServerEvents[K]['data']
          : unknown
      ) => void
    : never
>;

const socketOptions: Partial<ManagerOptions & SocketOptions> | undefined = {
  // reconnection: false,
  // reconnectionAttempts: 1,
  // reconnectionDelay: 100,
  port: 3000,
};
const socket = io(socketOptions);

export const bindSocketEvent = <K extends BindSocketEventName>(event: K, handler: BindSocketEventHandler<K>): void => {
  socket.on(event, handler);
};

export const removeSocketEvent = <K extends SocketClientEventName | SocketServerEventName>(
  event: K,
  handler: BindSocketEventHandler<K>
): void => {
  socket.removeListener(event, handler);
};

export const removeAllSocketEvents = <K extends SocketClientEventName | SocketServerEventName>(event: K): void => {
  socket.removeListener(event);
};

export const bindGlobalSocketEvents = () => {
  bindSocketEvent('connect', () => {
    console.log('connect');
  });

  bindSocketEvent('disconnect', () => {
    console.log('disconnect');
  });

  bindSocketEvent('connect_error', () => {
    // TODO: Handle this error
    console.log('connect error');
  });

  bindSocketEvent('id', (id: unknown) => {
    console.log('id');
  });

  bindSocketEvent('client', (clients: unknown) => {
    console.log('client');
  });
};

export const emitPersonalMessage = (message: IncomingPersonalMessage) => {
  const event = createSocketEvent('personalMessageClient', {
    data: { fromUserId: message.fromUserId, toUserId: message.toUserId },
  });
  socket.emit(event.name, event.data);
};

export default socket;
