import { Handler } from 'express';
import User from '../models/user';
import { validationResult } from 'express-validator';

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
        message: 'Fetched posts successfully.',
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
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is incorrect.');
    // error.statusCode = 422;
    throw error;
  }

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

// const seedServers = (): void => {
//   const servers = ['RS School', 'Vanilla Team', 'Twin Fin'].map((name) => new Server({
//     name: name,
//   }));

//   servers.forEach((server) => {
//     server
//     .save()
//     .then((result) => {
//       console.log(`Server ${server.name} was created.`);
//     })
//     .catch((err) => {
//       console.error(err);
//     });
//   });
// };

const getUser: Handler = (req, res, next) => {
  const userId = req.params.id;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        const error = new Error('Could not find post.');
        //error.statusCode = 404;
        throw error;
      }
      res.status(200).json({ messageInfo: 'User fetched.', user: user });
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
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is incorrect.');
    // error.statusCode = 422;
    throw error;
  }

  User.findById(userId)
    .then((user) => {
      if (!user) {
        const error = new Error('Could not find user.');
        // error.statusCode = 404;
        throw error;
      }
      const nameUser = req.body.name;
      const passwordUser = req.body.password;
      const emailUser = req.body.email;
      const phoneUser = req.body.phone;
      user.name = nameUser;
      user.password = passwordUser;
      user.email = emailUser;
      user.phone = phoneUser;
      return user.save();
    })
    .then((user) => {
      res.status(200).json({ messageInfo: 'user updated!', user });
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

export default { getUsers, createUser, getUser, updateUser, deleteUser };
