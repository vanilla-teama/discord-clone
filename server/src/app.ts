import express from 'express';
import http from 'http';
import mongoose from 'mongoose';
import path from 'path';
import { Server, Socket } from 'socket.io';
import serversRoutes from './routes/servers';
import usersRoutes from './routes/users';
import personalMessagesRoutes from './routes/personal-messages';
import chatsRoutes from './routes/chats';
import { initSocket } from './socket';
const port: number = 3001;

mongoose.set('strictQuery', true);

const isLocalConnection = true;

const mongooseUrl = isLocalConnection
  ? `mongodb://localhost:27017/discord`
  : 'mongodb+srv://superconscience:QrtczmnqiciavAoI@node.wiauk.mongodb.net/?retryWrites=true&w=majority';

type AppClients = Record<string, unknown>;

export class App {
  private server: http.Server;
  private port: number;

  private io: Server;
  private clients: AppClients = {};

  constructor(port: number) {
    this.port = port;
    const app = express();
    app.use(express.static(path.join(__dirname, '../../client/dist')));

    app.use(express.json());

    app.use('/servers', serversRoutes);
    app.use('/users', usersRoutes);
    app.use('/personal-messages', personalMessagesRoutes);
    app.use('/chats', chatsRoutes);

    this.server = new http.Server(app);

    this.io = initSocket(this);
    // this.io = new Server(this.server);

    // this.io.on('connection', (socket: Socket) => {
    //   console.log(socket.constructor.name);
    //   this.clients[socket.id] = {};
    //   socket.emit('id', socket.id);

    //   socket.on('disconnect', () => {
    //     console.log('socket disconnected : ' + socket.id);
    //     if (this.clients && this.clients[socket.id]) {
    //       delete this.clients[socket.id];
    //       this.io.emit('removeClient', socket.id);
    //     }
    //   });

    //   socket.on('userLoggedIn', (data) => {
    //     this.io.emit('userLoggedIn', data);
    //   });
    // });
  }

  public Start() {
    mongoose
      .connect(mongooseUrl)
      .then((result) => {
        // serversController.seedServers();
        this.server.listen(this.port, () => {
          console.log(`Server listening on port ${this.port}.`);
        });
      })
      .catch((err) => console.log(err));
  }

  getClients(): AppClients {
    return this.clients;
  }

  setClient(id: string, value: unknown): void {
    this.clients[id] = value;
  }

  getServer(): http.Server {
    return this.server;
  }
}

new App(port).Start();
