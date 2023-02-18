import express from 'express';
import channelsController from '../controllers/channels';
const router = express.Router();

router.get('/', channelsController.getChannels);
router.get('/:id', channelsController.getChannel);
router.get('/:id/messages', channelsController.getChannelMessages);
router.get('/:channelId/invites', channelsController.getChannelInvitesByChannelId);
router.post('/', channelsController.createChannel);
router.post('/messages', channelsController.createChannelMessage);
router.post('/invites', channelsController.createChannelInvite);
router.patch('/:id', channelsController.updateChannel);
router.patch('/messages/:id', channelsController.updateChannelMessage);
router.delete('/:id', channelsController.deleteChannel);
router.delete('/messages/:id', channelsController.deleteChannelMessage);

export default router;
