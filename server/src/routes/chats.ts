import express from 'express';
import chatsController from '../controllers/chats';

const router = express.Router();

// GET
router.post('/users/:userId', chatsController.createChat);
router.get('/users/:userId', chatsController.getChats);
router.get('/messages/:userOneId/:userTwoId', chatsController.getChatMessages);
router.get('/users/:userOneId/:userTwoId', chatsController.getChat);
router.delete('/users/:userOneId/:userTwoId', chatsController.deleteChat);

export default router;
