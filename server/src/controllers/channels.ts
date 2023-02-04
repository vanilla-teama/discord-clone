import { Handler } from 'express';
import Channel from '../models/channel';
import { validationResult } from 'express-validator';
const getChannels: Handler = (req, res, next) => {
  let docsCount = 0;
  Channel.find()
    .countDocuments()
    .then((count) => {
      docsCount = count;
      return Channel.find();
    })
    .then((channels) => {
      console.log(channels);
      res.status(200).json({
        message: 'Fetched channel successfully.',
        count: docsCount,
        channels,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

const createChannel: Handler = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is incorrect.');
    // error.statusCode = 422;
    throw error;
  }
  const channel = new Channel({
    serverId: req.body.serverId,
    name: req.body.name,
  });

  channel
    .save()
    .then(() => {
      res.status(201).json({
        message: 'channel created successfully!',
        channel,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

const deleteChannel: Handler = (req, res, next) => {
  const channelId = req.params.id;
  Channel.findById(channelId)
    .then((channel) => {
      if (!channel) {
        const error = new Error('Could not find channel.');
        // error.statusCode = 404;
        throw error;
      }
      return Channel.findByIdAndRemove(channelId);
    })
    .then((result) => {
      res.status(200).json({ messageInfo: 'channel message.' });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

const updateChannel: Handler = (req, res, next) => {
  const channelId = req.params.id;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is incorrect.');
    // error.statusCode = 422;
    throw error;
  }
  Channel.findById(channelId)
    .then((channel) => {
      if (!channel) {
        const error = new Error('Could not find message.');
        // error.statusCode = 404;
        throw error;
      }
      const channelName = req.body.name;
      channel.name = channelName;
      return channel.save();
    })
    .then((channel) => {
      res.status(200).json({ messageInfo: 'Message updated!', channel });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
export default { getChannels, createChannel, updateChannel, deleteChannel };
