import express from 'express'
import registerNewUser from '../controllers/authController.js'

const router=express.Router();
router.post('/register',registerNewUser);


export default router;