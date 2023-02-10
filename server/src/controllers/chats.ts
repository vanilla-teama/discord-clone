import { Handler, RequestHandler } from 'express';
import PersonalMessage from '../models/personal-message';
import User from '../models/user';
import { FetchedChat, chatDTO } from '../utils/dto';

const getChats: Handler = (req, res, next) => {
  const userId = req.params.userId;

  User
    .findById(userId)
    .populate('chats')
    .then((user) => {
      if (!user) {
        const error = new Error('Could not find user.');
        //error.statusCode = 404;
        throw error;
      }
      res.status(200).json({ chats: (user.chats || []).map((c) => chatDTO(c as FetchedChat))})
    })
  // PersonalMessage.find({
  //   $and: [
  //     { $or: [{ fromUserId: userId }, { toUserId: userId }] },
  //     { deleted: false },
  //   ],
  // })
  //   .select('fromUserId toUserId')
  //   .then((chats) => {
  //     const userIds = [
  //       ...new Set(chats.map(({ fromUserId, toUserId }) => [fromUserId, toUserId]).flat()),
  //     ].filter((id) => id.toString() !== userId);

  //     User.find({
  //       _id: {
  //         $in: userIds,
  //       }
  //     })
  //       .select('name')
  //       .then((users) => {
  //         res.status(200).json({
  //           message: 'Fetched chats successfully.',
  //           chats: users.map((u) => chatDTO(u)),
  //         });
  //       });
  //   })
  //   .catch((err) => {
  //     if (!err.statusCode) {
  //       err.statusCode = 500;
  //     }
  //     next(err);
  //   });
};

const deleteChat: Handler = (req, res, next) => {
  const { fromUserId, toUserId } = req.params;

  PersonalMessage.find({
    $or: [
      { $and: [{ fromUserId }, { toUserId }] },
      { $and: [{ fromUserId: toUserId }, { toUserId: fromUserId }] }
    ],
  })
    .updateMany({ deleted: true })
    .then((result) => {
      res.status(204).json({
        message: 'Deleted chat successfully.',
        result,
      });
  });
};

const getChatMessages: Handler = (req, res, next) => {
  const { userOneId, userTwoId } = req.params;

  PersonalMessage.find({
    $or: [
      { $and: [{ fromUserId: userOneId }, { toUserId: userTwoId }] },
      { $and: [{ fromUserId: userTwoId }, { toUserId: userOneId }] }
    ],
  })
    .then((messages) => {
      res.status(200).json({
        message: 'Fetched chat messages successfully.',
        messages: messages.map((m) => m),
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

export default { getChats, deleteChat, getChatMessages, createChat };
