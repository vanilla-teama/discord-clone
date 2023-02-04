import express from 'express';
import channelsController from '../controllers/channels';
const router = express.Router();

router.get('/', channelsController.getChannels);
router.get('/:id', channelsController.getChannel);
router.post('/', channelsController.createChannel);
router.patch('/:id', channelsController.updateChannel);
router.delete('/:id', channelsController.deleteChannel);

export default router;
