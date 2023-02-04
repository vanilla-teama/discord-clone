import express from 'express';
import { body } from 'express-validator/check';
import serversController from '../controllers/servers';
// const feedController = require('../controllers/feed');
// const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/', serversController.getServers);
router.get('/:id', serversController.getServer);
router.post('/', serversController.createServer);
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
