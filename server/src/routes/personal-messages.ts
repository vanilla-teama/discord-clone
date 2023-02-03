import express from 'express';
import personalMessagesController from '../controllers/personal-messages';

const router = express.Router();

// GET
router.get('/', personalMessagesController.getPersonalMessages);

export default router;
