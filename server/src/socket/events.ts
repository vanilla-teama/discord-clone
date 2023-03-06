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

  socket.on('userRegistered', (data) => {
    io.emit('userRegistered', data);
  });

  socket.on('userLoggedIn', ({ userId }) => {
    socket.broadcast.emit('userChangedAvailability', { userId, availability: Availability.Online });
  });

  socket.on('userLoggedOut', ({ userId }) => {
    socket.broadcast.emit('userChangedAvailability', { userId, availability: Availability.Offline });
  });

  socket.on('accountUpdated', (data) => {
    socket.broadcast.emit('accountUpdated', data);
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

  socket.on('channelMessage', (data) => {
    io.emit('channelMessage', data);
  });

  socket.on('channelMessageUpdated', (data) => {
    io.emit('channelMessageUpdated', data);
  });

  socket.on('channelMessageDeleted', (data) => {
    io.emit('channelMessageDeleted', data);
  });

  socket.on('userInvitedToFriends', (data) => {
    io.emit('userInvitedToFriends', data);
  });

  socket.on('userAddedToFriends', (data) => {
    io.emit('userAddedToFriends', data);
  });

  socket.on('friendInvitationCanceled', (data) => {
    io.emit('friendInvitationCanceled', data);
  });

  socket.on('friendDeleted', (data) => {
    io.emit('friendDeleted', data);
  });

  socket.on('userInvitedToChannel', (data) => {
    io.emit('userInvitedToChannel', data);
  });

  socket.on('serverAdded', (data) => {
    io.emit('serverAdded', data);
  });
};
