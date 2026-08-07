import express from 'express'
import {registerNewUser,login} from '../controllers/authController.js'

const router=express.Router();
router.post('/register',registerNewUser);
router.post('/login',login);


export default router;