import express from 'express';
import personalMessagesController from '../controllers/personal-messages';

const router = express.Router();

// GET
router.get('/', personalMessagesController.getPersonalMessages);
router.post('/', personalMessagesController.createPersonalMessage);

export default router;
