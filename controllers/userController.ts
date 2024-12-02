import { Request, Response } from 'express';
import User from '../models/User';
import { RequestWithUser } from '../middlewares/verifyJWT';
import { JwtPayload } from 'jsonwebtoken';



class UserController {
    async getAllUsers (req: Request, res: Response) : Promise<any> {
        try {
            const users = await User.find();
            res.json({ 
                success: true, 
                data: users 
            });
        } catch (error) {
            res.status(500).json({ 
                success: false, 
                message: 'Error fetching users.', error 
            });
        }
    }

    
    async getUserProfile (req: RequestWithUser<{user?: any | JwtPayload}>, res: Response) : Promise<any> {
        try {
            const user = await User.findById(req?.user?.id).select('-password');
            if (!user) {
                return res.status(404).json({ 
                    success: false, 
                    message: 'User not found.' 
                });
            }
            res.json({ 
                success: true, 
                data: user 
            });
        } catch (error) {
            res.status(500).json({ 
                success: false, 
                message: 'Error fetching user profile.', error 
            });
        }
    }

    async updateUserProfile (req: RequestWithUser<{user?: any | JwtPayload}>, res: Response) : Promise<any> {
        try {
            const {name, email} = req.body
            const user = await User.findById(req.user?.id);
            if (!user) {
                return res.status(404).json({ 
                    success: false, 
                    message: 'User not found.' 
                });
            }

            user.name = name;
            user.email = email;

            const saveUpdatedUser = await user.save()

            res.json({ 
                success: true,
                message : "Updated profile",
                data: saveUpdatedUser 
            });
        } catch (error) {
            res.status(500).json({ 
                success: false, 
                message: 'Error fetching user profile.', error 
            });
        }
    }
}


export default new UserController()

