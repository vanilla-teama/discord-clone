import express from 'express';
import chatsController from '../controllers/chats';

const router = express.Router();

// GET
router.post('/users/:userId', chatsController.createChat);
router.get('/users/:userId', chatsController.getChats);
router.get('/messages/:userOneId/:userTwoId', chatsController.getChatMessages);
router.delete('/users/:fromUserId/:toUserId', chatsController.deleteChat);

export default router;
