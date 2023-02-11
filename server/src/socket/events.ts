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
    const clients = app.getClients();
    if (clients && clients[socket.id]) {
      delete clients[socket.id];
      io.emit('removeClient', socket.id);
    }
  });

  socket.on('userLoggedIn', ({ userId }) => {
    console.log(userId);
    User.findById(userId)
      .then((user) => {
        if (user) {
          // We keep statuses like `Away` and `Do not disturb`
          const currentAvailability = user.availability;
          let newAvailability = currentAvailability;
          if (currentAvailability !== Availability.Away && currentAvailability !== Availability.DoNotDisturb) {
            newAvailability = Availability.Online;
          }

          if (newAvailability !== currentAvailability) {
            user.save().then((result) => {
              socket.broadcast.emit('userChangedAvailability', {
                availability: user.availability,
                userId: user.id.toString(),
              });
            });
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });

  socket.on('personalMessage', (data) => {
    io.emit('personalMessage', data);
  });
};
