import { Handler } from 'express';
import PersonalMessage from '../models/personal-message';
import User from '../models/user';

const getChats: Handler = (req, res, next) => {
  const userId = req.params.userId;

  PersonalMessage.find()
    .or([{ fromUserId: userId }, { toUserId: userId }])
    .select('fromUserId toUserId')
    .then((chats) => {
      const userIds = [
        ...new Set(chats.map(
          ({ fromUserId, toUserId }) => [fromUserId.toString(), toUserId.toString()]
        ).flat())
      ].filter((id) => id !== userId);

      User.findById(userIds)
        .select('name')
        .then((users) => {
          res.status(200).json({
            message: 'Fetched chats successfully.',
            chats: users,
          });
        })
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

export default { getChats };
