import express from 'express';
import userController from '../controllers/users';
import uploader from '../utils/upload';

const router = express.Router();

router.get('/check-auth', userController.checkAuth);
router.post('/login', userController.login);
router.post('/register', userController.register);
router.get('/logout', userController.logout);
router.get('/', userController.getUsers);
router.get('/search', userController.searchUsers);
router.post('/', userController.createUser);
router.get('/:id', userController.getUser);
router.get('/:id/friends', userController.getFriends);
router.get('/:id/invited-to-friends', userController.getInvitedToFriends);
router.get('/:id/invited-from-friends', userController.getInvitedFromFriends);
router.get('/:id/related-servers', userController.getRelatedServers);
router.get('/:id/related-channels', userController.getRelatedChannels);
router.patch('/:id', uploader.single('profile[avatar]'), userController.updateUser);
router.delete('/:id', userController.deleteUser);

router.get('/:id/friends', userController.getFriends);
router.patch('/:id/friends/', userController.updateFriends);

export default router;
