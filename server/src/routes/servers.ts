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
router.get('/:id/channels', serversController.getChannels);
router.post('/', uploader.single('image') , serversController.createServer);
router.patch('/:id', serversController.updateServer);
router.delete('/:id', serversController.deleteServer);

export default router;
