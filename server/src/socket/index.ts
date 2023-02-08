import { Server, Socket } from 'socket.io';
import { App } from '../app';
import User, { Availability } from '../models/user';
import { userDTO } from '../utils/dto';

export const initSocket = (app: App) => {
  const io = new Server(app.getServer());

  io.on('connection', (socket: Socket) => {
    console.log(socket.constructor.name);
    app.setClient(socket.id, {});
    socket.emit('id', socket.id);

    socket.on('disconnect', () => {
      console.log('socket disconnected : ' + socket.id);
      const clients = app.getClients();
      if (clients && clients[socket.id]) {
        delete clients[socket.id];
        io.emit('removeClient', socket.id);
      }
    });

    socket.on('userLoggedInClient', (data) => {
      User
        .findById(data.data.id)
        .then((user) => {
          if (user) {
            // We keep statuses like `Away` and `Do not disturb`
            if (user.availability !== Availability.Away && user.availability !== Availability.DoNotDisturb) {
              user.availability = Availability.Online;
            }

            user.save()
              .then((result) => {
                socket.broadcast.emit('userLoggedInServer', { user: userDTO(user) });
              })
          }
        })
          .catch((err) => {
            console.log(err);
          });
    });

    socket.on('personalMessageClient', (data) => {
      // socket.broadcast.emit('personalMessageServer', data);
      io.emit('personalMessageServer', data);
    });
  });

  return io;
};
