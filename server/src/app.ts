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
import testRoutes from './routes/test';
import { initSocket } from './socket';
import cors from 'cors';
import multer from 'multer';
import formidable from 'formidable';
import fs from 'fs';

const port: number = 3001;
const whitelist = ['http://localhost:3000', 'http://localhost:8005'];

mongoose.set('strictQuery', true);

const isLocalConnection = true;

const mongooseUrl = isLocalConnection
  ? `mongodb://localhost:27017/discord`
  : 'mongodb+srv://superconscience:QrtczmnqiciavAoI@node.wiauk.mongodb.net/?retryWrites=true&w=majority';

type AppClients = Record<string, unknown>;

const upload = multer({ limits: { fileSize: 1064960 }, dest: '/uploads/' }).single('image');

export class App {
  private server: http.Server;
  private port: number;

  private io: Server;
  private clients: AppClients = {};

  constructor(port: number) {
    this.port = port;
    const app = express();
    app.use(express.static(path.join(__dirname, '../../client/dist')));

    app.use(
      cors({
        origin: function (origin, callback) {
          if (origin && whitelist.indexOf(origin) !== -1) {
            callback(null, true);
          } else {
            callback(null, true);
            // callback(new Error('Not allowed by CORS'))
          }
        },
        credentials: true,
      })
    );

    // app.post('/servers', function (req, res) {
    //   upload(req, res, function (err) {
    //     if (err) {
    //       res.status(500).json({ error: 'message' });
    //     }

    //     console.log(req.file, req.files);

    //     if (req.file == null) {
    //       // If Submit was accidentally clicked with no file selected...
    //       res.send('boo');
    //     } else {
    //       // read the img file from tmp in-memory location
    //       const newImg = fs.readFileSync(req.file.path);
    //       // encode the file as a base64 string.
    //       const encImg = newImg.toString('base64');
    //       // define your new document
    //       const newItem = {
    //         description: req.body.description,
    //         contentType: req.file.mimetype,
    //         size: req.file.size,
    //         img: Buffer.from(encImg, 'base64'),
    //       };

    //       // db.collection('images').insert(newItem)
    //       //     .then(function() {
    //       //         console.log('image inserted!');
    //       //     });

    //       res.send('yo');
    //     }
    //   });
    // });

    app.use(express.json());

    // TODO: add validation
    app.use('/test', testRoutes);
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
