import path from 'path';
import { validationResult } from 'express-validator';
import Server from '../models/server';
import { Handler } from 'express';

const getServers: Handler = (req, res, next) => {
  let docsCount = 0;
  Server.find()
    .countDocuments()
    .then((count) => {
      docsCount = count;
      return Server.find();
    })
    .then((servers) => {
      console.log(servers);
      res.status(200).json({
        message: 'Fetched servers successfully.',
        count: docsCount,
        servers,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

const createServer: Handler = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is incorrect.');
    // error.statusCode = 422;
    throw error;
  }

  const server = new Server({
    name: req.body.name,
  });

  server
    .save()
    .then((result) => {
      res.status(201).json({
        message: 'Server created successfully!',
        server,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

const seedServers = (): void => {
  const servers = ['RS School', 'Vanilla Team', 'Twin Fin'].map(
    (name) =>
      new Server({
        name: name,
      })
  );

  servers.forEach((server) => {
    server
      .save()
      .then((result) => {
        console.log(`Server ${server.name} was created.`);
      })
      .catch((err) => {
        console.error(err);
      });
  });
};

const updateServer: Handler = (req, res, next) => {
  const serverId = req.params.id;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is incorrect.');
    // error.statusCode = 422;
    throw error;
  }
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
      res.status(200).json({ messageInfo: 'server updated!', server });
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

export default { getServers, createServer, seedServers, updateServer, deleteServer };
