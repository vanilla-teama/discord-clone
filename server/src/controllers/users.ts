import { Handler, NextFunction, Request, Response } from 'express';
import { body, check, validationResult } from 'express-validator';
import passport from 'passport';
import { IVerifyOptions } from 'passport-local';
import User, { Availability, UserDocument, validateUserField } from '../models/user';
import '../passport';
import { FetchedUser, userDTO } from '../utils/dto';
import { App } from '../app';
import { TypedRequest } from 'express.types';
import mongoose, { HydratedDocument } from 'mongoose';
import { requestErrorHandler } from '../utils/functions';

const checkAuth = (req: Request, res: Response, next: NextFunction): void => {
  if (req.user) {
    req.logIn(req.user, (err) => {
      if (err) {
        return next(err);
      }
      res.status(200).json({ user: userDTO(req.user as FetchedUser) });
    });
    return;
  }
  res.status(200).json({ user: null });
};

const login = async (req: TypedRequest, res: Response, next: NextFunction): Promise<void> => {
  await check('email', 'Email is not valid').isEmail().run(req);
  await check('password', 'Password cannot be blank').isLength({ min: 1 }).run(req);
  await body('email').normalizeEmail({ gmail_remove_dots: false }).run(req);

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(401).json(errors);
    return;
  }

  passport.authenticate('local', (err: Error, user: UserDocument, info: IVerifyOptions) => {
    if (err) {
      return next(err);
      return;
    }
    if (!user) {
      res.status(401).json({ message: info.message });
      return;
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      const { id } = user;
      User.findById(id)
        .then((user) => {
          if (!user) {
            const error = new Error('Could not find user.');
            //error.statusCode = 404;
            throw error;
          }
          user.availability = Availability.Online;
          user
            .save()
            .then(() => {
              res.status(200).json({ user: userDTO(user as FetchedUser) });
            })
            .catch((err) => requestErrorHandler(err, next)());
        })
        .catch((err) => requestErrorHandler(err, next)());
    });
  })(req, res, next);
};

const logout = (req: TypedRequest, res: Response, next: NextFunction): void => {
  const { id } = req.user as HydratedDocument<UserDocument>;
  req.logout((err) => {
    if (err) {
      next(err);
    }
    User.findById(id)
      .then((user) => {
        if (!user) {
          const error = new Error('Could not find user.');
          //error.statusCode = 404;
          throw error;
        }
        user.availability = Availability.Offline;
        user
          .save()
          .then(() => {
            res.status(200).end();
          })
          .catch((err) => requestErrorHandler(err, next)());
      })
      .catch((err) => requestErrorHandler(err, next)());
  });
};

const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  await check('email', 'Email is not valid').isEmail().run(req);
  await check('password', 'Password must be at least 4 characters long').isLength({ min: 4 }).run(req);
  // await check('confirmPassword', 'Passwords do not match').equals(req.body.password).run(req);
  await body('email').normalizeEmail({ gmail_remove_dots: false }).run(req);

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(401).json(errors);
    return;
  }

  const user = new User({
    email: req.body.email,
    password: req.body.password,
    name: req.body.name,
    phone: req.body.phone,
  });

  User.findOne({ email: req.body.email }, (err: NativeError, existingUser: UserDocument) => {
    if (err) {
      return next(err);
    }
    if (existingUser) {
      res.status(401).json({ message: 'Account with that email address already exists' });
      return;
    }
    user.save((err) => {
      if (err) {
        return next(err);
      }
      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }
        res.status(200).end();
      });
    });
  });
};

const getUsers: Handler = (req, res, next) => {
  let docsCount = 0;

  User.find()
    .countDocuments()
    .then((count) => {
      docsCount = count;
      return User.find().populate('chats');
    })
    .then((users) => {
      const exportedUsers = users.map((u) => userDTO(u));
      res.status(200).json({
        message: 'Fetched users successfully.',
        count: docsCount,
        users: exportedUsers,
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
      res.status(201).json({
        message: 'User created successfully!',
        user: userDTO(user),
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
  User.findById(userId)
    .then((user) => {
      if (!user) {
        const error = new Error('Could not find user.');
        //error.statusCode = 404;
        throw error;
      }
      res.status(200).json({ messageInfo: 'User fetched.', user: userDTO(user) });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

const searchUsers: Handler = (req, res, next) => {
  const search = req.query.search;

  if (!search) {
    res.status(200).json({ users: [] });
    return;
  }

  const regexpOptions = { $regex: search, $options: 'i' };

  User.find({ $or: [{ name: regexpOptions }, { email: regexpOptions }] })
    .then((users) => {
      res.status(200).json({
        message: 'Users found',
        users: users.map((u) => userDTO(u as FetchedUser)),
      });
    })
    .catch((err) => requestErrorHandler(err, next));
};

const updateUser: Handler = (req, res, next) => {
  const userId = req.params.id;

  User.findById(userId)
    .populate('chats')
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
          } else if (path === 'invitesFrom' || path === 'invitesTo') {
            user[path] = [...new Set((user[path] || []).map((id) => id.toString()).concat(req.body[path]))].map((id) =>
              new mongoose.Types.ObjectId(id)
            );
          }
        }
      });

      return user.save();
    })
    .then((user) => {
      res.status(200).json({ messageInfo: 'User updated!', user: userDTO(user) });
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

  User.findById(userId)
    .populate('friends')
    .then((user) => {
      if (!user) {
        const error = new Error('Could not find user.');
        // error.statusCode = 404;
        throw error;
      }
      const exportedFriends = user.friends.map((f) => userDTO(f as unknown as FetchedUser));
      res.status(200).json({ messageInfo: 'Friends fetched.', friends: exportedFriends });
    });
};

const getInvitedToFriends: Handler = (req, res, next) => {
  const userId = req.params.id;

  User.findById(userId)
    .populate('invitesTo')
    .then((user) => {
      if (!user) {
        const error = new Error('Could not find user.');
        // error.statusCode = 404;
        throw error;
      }
      const invitedToFriends = (user.invitesTo || []).map((f) => userDTO(f as unknown as FetchedUser));
      res.status(200).json({ message: 'Users invited to friends fetched.', invitedToFriends });
    });
};

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

  User.findById(userId)
    .populate('friends')
    .then((user) => {
      if (!user) {
        const error = new Error('Could not find user.');
        // error.statusCode = 404;
        throw error;
      }

      if (action === 'delete') {
        user.friends = user.friends.filter((friend) => !friendIds.includes(friend.id));

        return user.save().then((user) => {
          user.populate('friends').then((user) => {
            res.status(200).json({ messageInfo: 'Friends deleted!', friends: user.friends });
          });
        });
      }

      User.find({ _id: { $in: friendIds } })
        .select('id')
        .then((foundUsers) => {
          const newFriends = foundUsers.map((user) => user.id);
          user.friends = [...new Set([...user.friends.map((user) => user.id), ...newFriends])];

          return user.save();
        })
        .then((user) => {
          user.populate('friends').then((user) => {
            res.status(200).json({ messageInfo: 'Friends added!', friends: user.friends });
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

export default {
  getUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
  getFriends,
  getInvitedToFriends,
  updateFriends,
  login,
  register,
  checkAuth,
  logout,
  searchUsers,
};
