import { Handler } from 'express';
import Server from '../models/server';
import Channel from '../models/channel';
import fs from 'fs';
import { channelDTO } from '../utils/dto';
import { FetchedChannel } from '../utils/dto';

const getServers: Handler = (req, res, next) => {
  let docsCount = 0;
  Server.find()
    .countDocuments()
    .then((count) => {
      docsCount = count;
      return Server.find().populate('owner');
    })
    .then((servers) => {
      res.status(200).json({
        message: 'Fetched servers successfully.',
        count: docsCount,
        servers: servers.map((server) => {
          return server;
        }),
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

const getServer: Handler = (req, res, next) => {
  const serverId = req.params.id;
  Server.findById(serverId)
    .then((server) => {
      if (!server) {
        const error = new Error('Could not find server.');
        //error.statusCode = 404;
        throw error;
      }
      res.status(200).json({ messageInfo: 'Server fetched.', server });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

const createServer: Handler = (req, res, next) => {
  console.log(req.body);
  let imageBuffer: Buffer | null = null;
  if (req.file) {
    const image = fs.readFileSync(req.file.path);
    const encImage = image.toString('base64');
    imageBuffer = Buffer.from(encImage, 'base64');
  }
  const server = new Server({
    name: req.body.name,
    image: imageBuffer,
    owner: req.body.owner,
  });

  server
    .save()
    .then(() => {
      res.status(201).json({
        message: 'Server created successfully!',
        server,
      });
    })
    .catch((err: { statusCode: number; }) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

const updateServer: Handler = (req, res, next) => {
  const serverId = req.params.id;

  Server.findById(serverId)
    .then((server) => {
      if (!server) {
        const error = new Error('Could not find user.');
        // error.statusCode = 404;
        throw error;
      }
      const nameServer = req.body.name;
      server.name = nameServer;
      return server.save();
    })
    .then((server) => {
      res.status(200).json({ messageInfo: 'Server updated!', server });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
const deleteServer: Handler = (req, res, next) => {
  const serverId = req.params.id;
  Server.findById(serverId)
    .then((user) => {
      if (!user) {
        const error = new Error('Could not find server.');
        // error.statusCode = 404;
        throw error;
      }
      return Server.findByIdAndRemove(serverId);
    })
    .then((result) => {
      res.status(200).json({ messageInfo: 'Deleted server.' });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

const getChannels: Handler = (req, res, next) => {
  const serverId = req.params.id;
  let docsCount = 0;
  Channel.find({ serverId })
    .countDocuments()
    .then((count) => {
      docsCount = count;
      return Channel.find({ serverId });
    })
    .then((channels) => {
      res.status(200).json({
        message: 'Fetched channels successfully.',
        count: docsCount,
        channels: channels.map((channel) => channelDTO(channel as FetchedChannel)),
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

export default { getServers, createServer, getServer, updateServer, deleteServer, getChannels };
