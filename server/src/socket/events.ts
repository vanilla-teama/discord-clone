import { Server } from 'socket.io';
import { App } from '../app';
import User, { Availability } from '../models/user';
import { AppSocket, ClientToServerEvents, InterServerEvents, ServerToClientEvents, SocketData } from './types';

export const bindSocketEvents = (
  socket: AppSocket,
  io: Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>,
  app: App
): void => {
  socket.on('disconnect', () => {
    console.log('socket disconnected : ' + socket.id);
    const clients = App.getClients();
    if (clients && clients[socket.id]) {
      delete clients[socket.id];
      io.emit('removeClient', socket.id);
    }
  });

  socket.on('userLoggedIn', ({ userId }) => {
    socket.broadcast.emit('userChangedAvailability', { userId });
  });

  socket.on('userLoggedOut', ({ userId }) => {
    socket.broadcast.emit('userChangedAvailability', { userId });
  });

  socket.on('personalMessage', (data) => {
    io.emit('personalMessage', data);
  });

  socket.on('personalMessageUpdated', (data) => {
    io.emit('personalMessageUpdated', data);
  });

  socket.on('personalMessageDeleted', (data) => {
    io.emit('personalMessageDeleted', data);
  });

  socket.on('userInvited', (data) => {
    console.log('socket user invited');
    socket.broadcast.emit('userInvited', data);
  })
};
