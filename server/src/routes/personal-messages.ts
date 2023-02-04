import express from 'express';
import personalMessagesController from '../controllers/personal-messages';

export enum DeletedRequestQuery {
  With = 'with',
  Only = 'only',
}

const router = express.Router();

// GET
router.get('/', personalMessagesController.getPersonalMessages);
router.get('/:id', personalMessagesController.getPersonalMessage);
router.post('/', personalMessagesController.createPersonalMessage);
router.patch('/:id', personalMessagesController.updatePersonalMessage);
router.delete('/:id', personalMessagesController.deletePersonalMessage);

export default router;
