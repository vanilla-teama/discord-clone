import express from 'express';
import chatsController from '../controllers/chats';

const router = express.Router();

// GET
router.get('/users/:userId', chatsController.getChats);
router.delete('/users/:fromUserId/:toUserId', chatsController.deleteChat);

export default router;
