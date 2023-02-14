import { Handler } from 'express';
import Channel from '../models/channel';
import { channelDTO } from '../utils/dto';
import { FetchedChannel } from '../utils/dto';
const getChannels: Handler = (req, res, next) => {
  let docsCount = 0;
  Channel.find()
    .countDocuments()
    .then((count) => {
      docsCount = count;
      return Channel.find();
    })
    .then((channels) => {
      res.status(200).json({
        message: 'Fetched channels successfully.',
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

const getChannel: Handler = (req, res, next) => {
  const channelId = req.params.id;
  Channel.findById(channelId)
    .then((channel) => {
      if (!channel) {
        const error = new Error('Could not find channel.');
        //error.statusCode = 404;
        throw error;
      }
      res.status(200).json({ messageInfo: 'Channel fetched.', channel });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

const createChannel: Handler = (req, res, next) => {

  const channel = new Channel({
    serverId: req.body.serverId,
    name: req.body.name,
  });

  channel
    .save()
    .then(() => {
      res.status(201).json({
        message: 'Channel created successfully!',
        channel: channelDTO(channel as FetchedChannel),
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
      res.status(200).json({ messageInfo: 'Deleted channel' });
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

  Channel.findById(channelId)
    .then((channel) => {
      if (!channel) {
        const error = new Error('Could not find channel.');
        // error.statusCode = 404;
        throw error;
      }
      const channelName = req.body.name;
      channel.name = channelName;
      return channel.save();
    })
    .then((channel) => {
      res.status(200).json({ messageInfo: 'Channel updated!', channel });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
export default { getChannels, getChannel, createChannel, updateChannel, deleteChannel };
