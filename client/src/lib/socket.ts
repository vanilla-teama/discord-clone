import { SocketOptions } from 'engine.io-client';
import { ManagerOptions, Socket, io } from 'socket.io-client';
import { IncomingPersonalMessage } from '../store/app-store';
import { ClientToServerEvents, ServerToClientEvents } from '../types/socket';

const socketOptions: Partial<ManagerOptions & SocketOptions> | undefined = {
  // reconnection: false,
  // reconnectionAttempts: 1,
  // reconnectionDelay: 100,
  port: 3000,
};

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io('https://server-production-b796.up.railway.app', {
  withCredentials: true,
  extraHeaders: {
    'Access-Control-Allow-Origin': '*',
  },
});

export const createSocketEvent = <K extends keyof ClientToServerEvents>(
  name: K,
  data: Parameters<ClientToServerEvents[K]>[0]
) => ({
  name,
  data,
});

export const bindGlobalSocketEvents = () => {
  socket.on('connect', () => {
    console.log('connect');
  });

  socket.on('disconnect', () => {
    console.log('disconnect');
  });

  socket.on('connect_error', () => {
    // TODO: Handle this error
    console.log('connect error');
  });

  socket.on('id', (id) => {
    console.log('socket id', id);
  });
};

export const emitPersonalMessage = (message: IncomingPersonalMessage) => {
  const event = createSocketEvent('personalMessage', { fromUserId: message.fromUserId, toUserId: message.toUserId });
  socket.emit(event.name, event.data);
};

export default socket;
