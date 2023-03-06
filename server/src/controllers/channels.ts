import { Handler } from 'express';
import Channel from '../models/channel';
import ChannelInvite from '../models/channel-invite';
import { FetchedChannelMessage, channelDTO, channelInviteDTO, channelMessageDTO } from '../utils/dto';
import { FetchedChannel } from '../utils/dto';
import ChannelMessage from '../models/channel-message';
import { requestErrorHandler } from '../utils/functions';
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
    general: req.body.general,
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

const getChannelMessages: Handler = (req, res, next) => {
  const { id } = req.params;
  console.log('getChannelMessages', id);

  ChannelMessage.find({ channelId: id })
    .populate('responsedToMessage')
    .then((messages) => {
      res.status(200).json({
        message: 'Fetched channel messages successfully.',
        messages: messages.map((m) => channelMessageDTO(m)),
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

const createChannelMessage: Handler = (req, res, next) => {
  const channelMessage = new ChannelMessage({
    userId: req.body.userId,
    channelId: req.body.channelId,
    responsedToMessageId: req.body.responsedToMessageId,
    responsedToMessage: req.body.responsedToMessageId,
    message: req.body.message,
    service: req.body.service,
  });

  channelMessage
    .save()
    .then((channelMessage) => {
      channelMessage
        .populate('responsedToMessage')
        .then((channelMessage) => {
          res.status(201).json({
            message: 'Message created successfully!',
            channelMessage: channelMessageDTO(channelMessage as FetchedChannelMessage),
          });
        })
        .catch((err) => requestErrorHandler(err, next));
    })
    .catch((err) => requestErrorHandler(err, next));
};

const updateChannelMessage: Handler = (req, res, next) => {
  const messageId = req.params.id;

  ChannelMessage.findById(messageId)
    .then((message) => {
      if (!message) {
        const error = new Error('Could not find message.');
        // error.statusCode = 404;
        throw error;
      }
      const contentMessage = req.body.message;
      message.message = contentMessage;
      return message.save();
    })
    .then((message) => {
      message.populate('responsedToMessage').then((message) => {
        res
          .status(200)
          .json({ messageInfo: 'Message updated!', message: channelMessageDTO(message as FetchedChannelMessage) });
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

const deleteChannelMessage: Handler = (req, res, next) => {
  const messageId = req.params.id;
  ChannelMessage.findById(messageId)
    .then((message) => {
      if (!message) {
        const error = new Error('Could not find message.');
        // error.statusCode = 404;
        throw error;
      }
      return ChannelMessage.findByIdAndRemove(messageId);
    })
    .then((result) => {
      res.status(200).json({ messageInfo: 'Deleted message.' });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

const getChannelInvitesByChannelId: Handler = (req, res, next) => {
  const {  channelId } = req.params;
  ChannelInvite.find({ channelId })
    .then((invites) => {
      res.status(200).json({
        message: 'Fetched channels successfully.',
        invites: invites.map((invite) => channelInviteDTO(invite)),
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

const createChannelInvite: Handler = (req, res, next) => {
  console.log(req.body);
  const invite = new ChannelInvite({
    channelId: req.body.channelId,
    userId: req.body.userId,
    messageId: req.body.messageId,
    message: req.body.message,
    status: req.body.status,
  });

  invite
    .save()
    .then(() => {
      res.status(201).json({
        message: 'Invite created successfully!',
        invite: channelInviteDTO(invite),
      });
    })
    .catch((err) => requestErrorHandler(err, next));
};

export default {
  getChannels,
  getChannel,
  createChannel,
  updateChannel,
  deleteChannel,
  getChannelMessages,
  createChannelMessage,
  updateChannelMessage,
  deleteChannelMessage,
  createChannelInvite,
  getChannelInvitesByChannelId,
};
