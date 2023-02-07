import { Handler } from 'express';
import PersonalMessage from '../models/personal-message';
import User from '../models/user';
import { chatDTO } from '../utils/dto';

const getChats: Handler = (req, res, next) => {
  const userId = req.params.userId;

  PersonalMessage.find({
    $and: [
      { $or: [{ fromUserId: userId }, { toUserId: userId }] },
      { deleted: false },
    ],
  })
    .select('fromUserId toUserId')
    .then((chats) => {
      const userIds = [
        ...new Set(chats.map(({ fromUserId, toUserId }) => [fromUserId, toUserId]).flat()),
      ].filter((id) => id.toString() !== userId);

      User.find({
        _id: {
          $in: userIds,
        }
      })
        .select('name')
        .then((users) => {
          res.status(200).json({
            message: 'Fetched chats successfully.',
            chats: users.map((u) => chatDTO(u)),
          });
        });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
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

export default { getChats, deleteChat, getChatMessages };
