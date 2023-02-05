import { Handler } from 'express';
import User, { validateUserField } from '../models/user';

const getUsers: Handler = (req, res, next) => {
  let docsCount = 0;

  User.find()
    .countDocuments()
    .then((count) => {
      docsCount = count;
      return User.find();
    })
    .then((users) => {
      res.status(200).json({
        message: 'Fetched users successfully.',
        count: docsCount,
        users,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

const createUser: Handler = (req, res, next) => {
  
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    phone: req.body.phone,
  });

  user
    .save()
    .then((result) => {
      console.log(result);
      res.status(201).json({
        message: 'User created successfully!',
        server: user,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

const getUser: Handler = (req, res, next) => {
  const userId = req.params.id;
  User
    .findById(userId)
    .then((user) => {
      if (!user) {
        const error = new Error('Could not find post.');
        //error.statusCode = 404;
        throw error;
      }
      res.status(200).json({ messageInfo: 'User fetched.', user });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

const updateUser: Handler = (req, res, next) => {
  const userId = req.params.id;
  
  User.findById(userId)
    .then((user) => {
      if (!user) {
        const error = new Error('Could not find user.');
        // error.statusCode = 404;
        throw error;
      }
      Object.entries(User.schema.paths).map(([path, data]) => {
        if (req.body[path]) {
          if (path === 'name' || path === 'email' || path === 'password' || path === 'phone') {
            user[path] = req.body[path];
          }
        }
      });
      
      return user.save();
    })
    .then((user) => {
      res.status(200).json({ messageInfo: 'User updated!', user });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

const deleteUser: Handler = (req, res, next) => {
  const userId = req.params.id;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        const error = new Error('Could not find user.');
        // error.statusCode = 404;
        throw error;
      }
      return User.findByIdAndRemove(userId);
    })
    .then((result) => {
      res.status(200).json({ messageInfo: 'Deleted user.' });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

const getFriends: Handler = (req, res, next) => {
  const userId = req.params.id;

  User
    .findById(userId)
    .populate('friends')
    .then((user) => {
      if (!user) {
        const error = new Error('Could not find user.');
        // error.statusCode = 404;
        throw error;
      }
      res.status(200).json({ messageInfo: 'Friends fetched.', friends: user.friends });
    })
}

const updateFriends: Handler = async (req, res, next) => {
  const userId = req.params.id;
  let friendIds = req.body.friends;
  const { action } = req.query;

  if (!validateUserField(friendIds, 'friends')) {
    const error = new Error('Validation failed, entered data is incorrect.');
    // error.statusCode = 422;
    next(error);
    return;
  }
  
  if (typeof action !== 'string' || !['add', 'delete'].includes(action)) {
    const error = new Error('Validation failed, `action` query parameter is required.');
    // error.statusCode = 422;
    next(error);
    return;
  }

  friendIds = friendIds.filter((id) => id !== userId);

  User
    .findById(userId)
    .populate('friends')
    .then((user) => {

      if (!user) {
        const error = new Error('Could not find user.');
        // error.statusCode = 404;
        throw error;
      }
      
      if (action === 'delete') {

        user.friends = user.friends.filter((friend) => !friendIds.includes(friend.id));

        return user
          .save()
          .then((user) => {
            user
              .populate('friends')
              .then((user) => {
                res.status(200).json({ messageInfo: 'Friends deleted!', friends: user.friends });
              })
          });
      }

      User
        .find({ _id: { $in: friendIds }})
        .select('id')
        .then((foundUsers) => {
          const newFriends = foundUsers.map((user) => user.id);
          user.friends = [...new Set([...user.friends.map((user) => user.id), ...newFriends])];

          return user.save();
        })
        .then((user) => {
          user
            .populate('friends')
            .then((user) => {
              res.status(200).json({ messageInfo: 'Friends added!', friends: user.friends });
            })
        });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
}

export default { getUsers, createUser, getUser, updateUser, deleteUser, getFriends, updateFriends };
