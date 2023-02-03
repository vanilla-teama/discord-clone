import path from 'path';
import { validationResult } from 'express-validator';
import PersonalMessage from '../models/personal-message';
import { Handler } from 'express';

const getPersonalMessages: Handler = (req, res, next) => {
  let totalItems = 0;

  PersonalMessage.find()
    .countDocuments()
    .then((count) => {
      console.log(count);
      totalItems = count;
    })
    .then((servers) => {
      res.status(200).json({
        message: 'Fetched personal messages successfully.',
        servers,
        totalItems,
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
    .then((result) => {
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

// exports.createPost = (req, res, next) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     const error = new Error('Validation failed, entered data is incorrect.');
//     error.statusCode = 422;
//     throw error;
//   }
//   if (!req.file) {
//     const error = new Error('No image provided.');
//     error.statusCode = 422;
//     throw error;
//   }
//   const imageUrl = req.file.path;
//   const title = req.body.title;
//   const content = req.body.content;
//   let creator;
//   const post = new Post({
//     title: title,
//     content: content,
//     imageUrl: imageUrl,
//     creator: req.userId
//   });
//   post
//     .save()
//     .then(result => {
//       return User.findById(req.userId);
//     })
//     .then(user => {
//       creator = user;
//       user.posts.push(post);
//       return user.save();
//     })
//     .then(result => {
//       res.status(201).json({
//         message: 'Post created successfully!',
//         post: post,
//         creator: { _id: creator._id, name: creator.name }
//       });
//     })
//     .catch(err => {
//       if (!err.statusCode) {
//         err.statusCode = 500;
//       }
//       next(err);
//     });
// };

const getPersonalMessage: Handler = (req, res, next) => {
  const personalMessageId = req.params.id;
  PersonalMessage.findById(personalMessageId)
    .then((message) => {
      if (!message) {
        const error = new Error('Could not find message.');
        // error.statusCode = 404;
        throw error;
      }
      res.status(200).json({ message: 'Message fetched.', messageId: message });
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
        const error = new Error('Could not find post.');
        // error.statusCode = 404;
        throw error;
      }
      // if (!message.responsedMessageId || message.responsedMessageId.toString() !== personalMessageId) {
      //   const error = new Error('Not authorized!');
      //   // error.statusCode = 403;
      //   throw error;
      // }

      const contentMessage = req.body.message;
      message.message = contentMessage;
      return message.save();
    })
    .then((result) => {
      res.status(200).json({ message: 'Message updated!', messageRes: result });
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
  PersonalMessage.findById(personalMessageId).then((message) => {
    if (!message) {
      const error = new Error('Could not find message.');
      // error.statusCode = 404;
      throw error;
    }
    // if (post.creator.toString() !== req.userId) {
    //   const error = new Error('Not authorized!');
    //   error.statusCode = 403;
    //   throw error;
    // }
    // Check logged in user

    return PersonalMessage.findByIdAndRemove(personalMessageId);
  });
  // .then((result) => {
  //   return User.findById(req.);
  // })
  // .then((user) => {
  //   user.posts.pull(postId);
  //   return user.save();
  // })
  // .then((result) => {
  //   res.status(200).json({ message: 'Deleted post.' });
  // })
  // .catch((err) => {
  //   if (!err.statusCode) {
  //     err.statusCode = 500;
  //   }
  //   next(err);
  // });
};

export default {
  getPersonalMessages,
  getPersonalMessage,
  createPersonalMessage,
  updatePersonalMessage,
  deletePersonalMessage,
};
