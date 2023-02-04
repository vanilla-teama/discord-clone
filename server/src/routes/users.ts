import express from 'express';
import userController from '../controllers/users';

const router = express.Router();

router.get('/', userController.getUsers);
router.post('/', userController.createUser);
router.get('/:id', userController.getUsers);
router.patch('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);
export default router;
