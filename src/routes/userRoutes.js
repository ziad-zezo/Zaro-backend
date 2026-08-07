import express from 'express';
import { getUsers, getUser, updateUser, deleteUser,createUser } from '../controllers/userController.js';

const router = express.Router();
router.get('/', getUsers);
router.post('/', createUser);
router.get('/:id', getUser);
router.patch('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;