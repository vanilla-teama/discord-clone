import path from 'path';
import { validationResult } from 'express-validator';
import PersonalMessage from '../models/personal-message';
import { Handler } from 'express';

const getPersonalMessages: Handler = (req, res, next) => {
  let docsCount = 0;
  console.log(req.query);
  PersonalMessage.find()
    .countDocuments()
    .then((count) => {
      docsCount = count;
      return PersonalMessage.find();
    })
    .then((personalMessages) => {
      res.status(200).json({
        message: 'Fetched personal messages successfully.',
        count: docsCount,
        servers: personalMessages,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

const createPersonalMessage: Handler = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is incorrect.');
    // error.statusCode = 422;
    throw error;
  }

  const personalMessage = new PersonalMessage({
    fromUserId: req.body.fromUserId,
    toUserId: req.body.toUserId,
    responsedMessageId: req.body.responsedMessageId,
    message: req.body.message,
  });

  personalMessage
    .save()
    .then(() => {
      res.status(201).json({
        message: 'Message created successfully!',
        personalMessage,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

const getPersonalMessage: Handler = (req, res, next) => {
  const personalMessageId = req.params.id;

  PersonalMessage.findById(personalMessageId)
    .then((message) => {
      if (!message) {
        const error = new Error('Could not find message.');
        // error.statusCode = 404;
        throw error;
      }
      res.status(200).json({ messageInfo: 'Message fetched.', message: message });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

const updatePersonalMessage: Handler = (req, res, next) => {
  const personalMessageId = req.params.id;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is incorrect.');
    // error.statusCode = 422;
    throw error;
  }

  PersonalMessage.findById(personalMessageId)
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
      res.status(200).json({ messageInfo: 'Message updated!', message });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

const deletePersonalMessage: Handler = (req, res, next) => {
  const personalMessageId = req.params.id;
  PersonalMessage.findById(personalMessageId)
    .then((message) => {
      if (!message) {
        const error = new Error('Could not find message.');
        // error.statusCode = 404;
        throw error;
      }
      return PersonalMessage.findByIdAndRemove(personalMessageId);
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

export default {
  getPersonalMessages,
  getPersonalMessage,
  createPersonalMessage,
  updatePersonalMessage,
  deletePersonalMessage,
};
