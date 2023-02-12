import express from 'express';
import userController from '../controllers/users';

const router = express.Router();

router.get('/check-auth', userController.checkAuth);
router.post('/login', userController.login);
router.post('/register', userController.register);
router.get('/logout', userController.logout);
router.get('/', userController.getUsers);
router.post('/', userController.createUser);
router.get('/:id', userController.getUser);
router.patch('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

router.get('/:id/friends', userController.getFriends);
router.patch('/:id/friends/', userController.updateFriends);

export default router;
