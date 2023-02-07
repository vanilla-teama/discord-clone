import express from 'express';
import http from 'http';
import mongoose from 'mongoose';
import path from 'path';
import { Server } from 'socket.io';
import serversRoutes from './routes/servers';
import usersRoutes from './routes/users';
import personalMessagesRoutes from './routes/personal-messages';
import chatsRoutes from './routes/chats';
import channelsRoutes from './routes/channels';
import { initSocket } from './socket';
import cors from 'cors';

const port: number = 3001;
const whitelist = ['http://localhost:3000', 'http://localhost:8005']

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

    app.use(cors({
      origin: function(origin, callback) {
        if (origin && whitelist.indexOf(origin) !== -1) {
          callback(null, true)
        } else {
          callback(null, true);
          // callback(new Error('Not allowed by CORS'))
        }
      },
      credentials: true,
    }));
    app.use(express.json());

    // TODO: add validation
    app.use('/servers', serversRoutes);
    app.use('/users', usersRoutes);
    app.use('/personal-messages', personalMessagesRoutes);
    app.use('/chats', chatsRoutes);
    app.use('/channels', channelsRoutes);

    this.server = new http.Server(app);

    this.io = initSocket(this);
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
