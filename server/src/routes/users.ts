import express from 'express';
import userController from '../controllers/users';

const router = express.Router();

// GET
router.get('/', userController.getUsers);
router.post('/', userController.createUser);

export default router;
