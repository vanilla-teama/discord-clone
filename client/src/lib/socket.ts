import { io } from 'socket.io-client';
import { MongoObjectId } from '../types/entities';
import { IncomingPersonalMessage } from '../store/app-store';
import { FallbackToUntypedListener } from '@socket.io/component-emitter';

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

const socket = io({ reconnection: false });

export const bindEvent = <K extends SocketClientEventName | SocketServerEventName>(
  event: K,
  handler: FallbackToUntypedListener<
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
  >
): void => {
  socket.on(event, handler);
};

export const removeSocketEvent = <K extends SocketClientEventName | SocketServerEventName>(event: K): void => {
  socket.removeListener(event);
};

export const bindGlobalSocketEvents = () => {
  bindEvent('connect', () => {});

  bindEvent('disconnect', () => {});

  bindEvent('connect_error', () => {
    // TODO: Handle this error
    console.log('connect error');
  });

  bindEvent('id', (id: unknown) => {});

  bindEvent('client', (clients: unknown) => {});
};

export const emitPersonalMessage = (message: IncomingPersonalMessage) => {
  const event = createSocketEvent('personalMessageClient', {
    data: { fromUserId: message.fromUserId, toUserId: message.toUserId },
  });
  socket.emit(event.name, event.data);
};

export default socket;
