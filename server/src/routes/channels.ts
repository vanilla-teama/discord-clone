import express from 'express';
import channelsController from '../controllers/channels';
const router = express.Router();

router.get('/', channelsController.getChannels);
router.get('/:id', channelsController.getChannel);
router.get('/:id/messages', channelsController.getChannelMessages);
router.post('/', channelsController.createChannel);
router.post('/messages', channelsController.createChannelMessage);
router.patch('/:id', channelsController.updateChannel);
router.delete('/:id', channelsController.deleteChannel);

export default router;
