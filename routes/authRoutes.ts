import express from 'express';
import authController from '../controllers/authController';

const router = express.Router();

// Register trainee 
router.post('/register', authController.registerUser);

// Login for all users
router.post('/login', authController.loginUser);


export default router;
