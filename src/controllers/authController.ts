import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import User from '../models/User';
import env from '../config/globalEnv';
import { registerSchema } from '../validations/authValidation';
import { handleZodError } from '../utils/handleZodError';



class AuthController {
    async registerUser (req: Request, res: Response) : Promise<any> {

        try {

            const validatedData = registerSchema.parse(req.body);

            const { fullName, email, password } = validatedData;

            console.log({ fullName, email, password });
            


            const existingUser = await User.findOne({ email });
            if (existingUser) return res.status(400).json({ success: false, message: 'User already exists.' });
    
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new User({ 
                email, 
                password: hashedPassword, 
                name : fullName, 
                role: 'trainee'
            });

            await newUser.save();
    
            const token = jwt.sign({ 
                id: newUser._id, 
                role: newUser.role 
            }, env.JWT_SECRET!, { expiresIn: '1h' });
    
            res.status(201).json({ 
                success: true, 
                token,
            });
        } catch (error) {
            const zodErrors = handleZodError(error);
            
            return res.status(500).json({ 
                success: false, 
                message: 'Error during registration.', 
                errors: zodErrors
            });
        }
    }

    async loginUser (req: Request, res: Response) : Promise<any> {
        const { email, password } = req.body;
        try {
            const user = await User.findOne({ email })
    
            if (!user) return res.status(400).json({ 
                success: false, 
                message: 'Invalid credentials.'
            });
    
            const isMatch = await bcrypt.compare(password, user.password);
    
            if (!isMatch) return res.status(400).json({ 
                success: false, 
                message: 'Invalid credentials.' 
            });
    
            const token = jwt.sign({ 
                id: user._id, 
                role: user.role 
            }, process.env.JWT_SECRET!, { expiresIn: '1h' });

            res.cookie('token', token, {
                httpOnly: true, 
                secure: process.env.NODE_ENV === 'production', 
                sameSite: 'none',
                maxAge: 3600000 
            });

            res.json({ 
                success: true, 
                token,
                _id : user._id,
                role : user.role,
                name : user.name,
                email: user.email
            });
        } catch (error) {
            res.status(500).json({ 
                success: false, 
                message: 'Error during login.', error });
        }
    }
}

export default new AuthController()

