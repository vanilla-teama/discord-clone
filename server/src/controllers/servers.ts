import { Handler } from 'express';
import Server from '../models/server';
import Channel from '../models/channel';
import fs from 'fs';
import { FetchedServer, channelDTO, serverDTO } from '../utils/dto';
import { FetchedChannel } from '../utils/dto';
import { requestErrorHandler } from '../utils/functions';
import sharp from 'sharp';

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
          return serverDTO(server as FetchedServer & { image: Buffer });
        }),
      });
    })
    .catch((err) => requestErrorHandler(err, next))
};

const getServer: Handler = (req, res, next) => {
  const serverId = req.params.id;
  Server
    .findById(serverId)
    .populate('owner')
    .then((server) => {
      if (!server) {
        const error = new Error('Could not find server.');
        //error.statusCode = 404;
        throw error;
      }
      res.status(200).json({ messageInfo: 'Server fetched.', server: serverDTO(server as FetchedServer & { image: Buffer }) });
    })
    .catch((err) => requestErrorHandler(err, next))
};

const createServer: Handler = async (req, res, next) => {
  let imageBuffer: Buffer | null = null;
  if (req.file) {
    const buffer = await sharp(req.file.path).resize().jpeg({ quality: 10 }).toBuffer();
    fs.unlinkSync(req.file.path);
    imageBuffer = Buffer.from(buffer.toString('base64'), 'base64');
    // const image = fs.readFileSync(req.file.path);
    // const encImage = image.toString('base64');
    // imageBuffer = Buffer.from(encImage, 'base64');
  }
  const server = new Server({
    name: req.body.name,
    image: imageBuffer,
    owner: req.body.owner,
  });

  server
    .save()
    .then(() => {
      server
        .populate('owner')
        .then((server) => {
          res.status(201).json({
            message: 'Server created successfully!',
            server: serverDTO(server as FetchedServer & { image: Buffer }),
          });
        })
    })
    .catch((err) => requestErrorHandler(err, next))
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
      server
        .populate('owner')
        .then((server) => {
          res.status(200).json({ messageInfo: 'Server updated!', server: serverDTO(server as FetchedServer & { image: Buffer }) });
        })
    })
    .catch((err) => requestErrorHandler(err, next))
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
    .catch((err) => requestErrorHandler(err, next))
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
    .catch((err) => requestErrorHandler(err, next))
};

export default { getServers, createServer, getServer, updateServer, deleteServer, getChannels };
