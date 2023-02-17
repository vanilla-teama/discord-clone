import { Handler, RequestHandler, NextFunction, Request, Response } from 'express';
import PersonalMessage from '../models/personal-message';
import User from '../models/user';
import { FetchedChat, chatDTO, personalMessageDTO } from '../utils/dto';
import { TypedRequest } from 'express.types';
import { handleDocumentNotFound, requestErrorHandler } from '../utils/functions';

const getChats: Handler = (req, res, next) => {
  const userId = req.params.userId;

  User
    .findById(userId)
    .populate('chats')
    .then((user) => {
      if (handleDocumentNotFound(user)) {
        res.status(200).json({ chats: (user.chats || []).map((c) => chatDTO(c as FetchedChat))})
      } else {
        res.status(200).json({ chats: []});
      }
    })
};

const getChat = (req: TypedRequest, res: Response, next: NextFunction): void => {
  const { userOneId, userTwoId } = req.params;
  
  User
    .findById(userTwoId)
    // .populate('chats')
    .then((user) => {
      if (handleDocumentNotFound(user)) {
        res.status(200).json({ chat: chatDTO(user as FetchedChat) });
      }
    })
      .catch(err => requestErrorHandler(err, next)());
}

const deleteChat: Handler = (req, res, next) => {
  const { userOneId, userTwoId } = req.params;

  User
    .findById(userOneId)
    .populate('chats')
    .then((user) => {
      if (handleDocumentNotFound(user)) {
        user.chats = user.chats.filter(({ id }) => id.toString() !== userTwoId);

        user.save()
          .then(() => {
            res.status(200).json({ message: 'Chat deleted successfully' });
          })
          .catch(err => requestErrorHandler(err, next)());
      }
    })
    .catch(err => requestErrorHandler(err, next)());
};

const getChatMessages: Handler = (req, res, next) => {
  const { userOneId, userTwoId } = req.params;

  PersonalMessage.find({
    $or: [
      { $and: [{ fromUserId: userOneId }, { toUserId: userTwoId }] },
      { $and: [{ fromUserId: userTwoId }, { toUserId: userOneId }] }
    ],
  })
    .populate('responsedToMessage')
    .then((messages) => {
      res.status(200).json({
        message: 'Fetched chat messages successfully.',
        messages: messages.map((m) => personalMessageDTO(m)),
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

const createChat: RequestHandler = (req, res, next) => {
  // TODO: Add validation
  const { userId: userOneId } = req.params;
  const { userId: userTwoId } = req.body;
  User
    // .findById(userOneId)
    .findById(userOneId)
    .populate('chats')
    .then((userOne) => {
      if (!userOne) {
        //error.statusCode = 404;
        throw new Error('Could not find first user.');
      }
      User
        // .findById(userTwoId)
        .findById(userTwoId)
        .populate('chats')
        .select('id')
        .then((userTwo) => {
          if (!userTwo) {
            //error.statusCode = 404;
            throw new Error('Could not find second user.');
          }

          const chatsOne = [...new Set((userOne.chats || []).map((c) => c.id).concat(userTwo.id))];
          const chatsTwo = [...new Set((userTwo.chats || []).map((c) => c.id).concat(userOne.id))];
          
          userOne.chats = chatsOne;
          userTwo.chats = chatsTwo;

          userOne
            .save()
            .then(() => {
              userTwo.save()
              .then(() => {
                res.status(200).end();
              })
              .catch((err) => {
                if (!err.statusCode) {
                  err.statusCode = 500;
                }
                next(err);
              });
            })
            .catch((err) => {
              if (!err.statusCode) {
                err.statusCode = 500;
              }
              next(err);
            });
        })
    })
}

export default { getChats, deleteChat, getChatMessages, createChat, getChat };
