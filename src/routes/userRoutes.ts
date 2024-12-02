import express from 'express';
import userController from '../controllers/userController';
import verifyJWT from '../middlewares/verifyJWT';
import checkRole from '../middlewares/checkRole';

const router = express.Router();


// get user profile
router.get('/profile', verifyJWT, checkRole(["trainee"]), userController.getUserProfile)

// update profle
router.put('/profile-update', verifyJWT, checkRole(["trainee"]), userController.updateUserProfile);


export default router;
