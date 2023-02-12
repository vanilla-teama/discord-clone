import express from 'express';
import { body } from 'express-validator/check';
import serversController from '../controllers/servers';
import multer from 'multer';
// const feedController = require('../controllers/feed');
// const isAuth = require('../middleware/is-auth');

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (request, file, callback) {
      callback(null, './uploads/');
  },
  filename: function (request, file, callback) {
      callback(null, file.originalname)
  }
});

const uploader = multer({
  dest: '/uploads',
  storage: storage,
});

router.get('/', serversController.getServers);
router.get('/:id', serversController.getServer);
router.post('/', uploader.single('image') , serversController.createServer);
router.patch('/:id', serversController.updateServer);
router.delete('/:id', serversController.deleteServer);

// POST /feed/post
// router.post(
//   '/post',
//   isAuth,
//   [
//     body('title')
//       .trim()
//       .isLength({ min: 5 }),
//     body('content')
//       .trim()
//       .isLength({ min: 5 })
//   ],
//   feedController.createPost
// );

// router.get('/post/:postId', isAuth, feedController.getPost);

// router.put(
//   '/post/:postId',
//   isAuth,
//   [
//     body('title')
//       .trim()
//       .isLength({ min: 5 }),
//     body('content')
//       .trim()
//       .isLength({ min: 5 })
//   ],
//   feedController.updatePost
// );

// router.delete('/post/:postId', isAuth, feedController.deletePost);

export default router;
