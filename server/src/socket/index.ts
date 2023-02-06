import { Server, Socket } from 'socket.io';
import { App } from '../app';

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
      socket.broadcast.emit('userLoggedInServer', data);
    });

    socket.on('personalMessageClient', (data) => {
      socket.broadcast.emit('personalMessageServer', data);
    });
  });

  return io;
};
