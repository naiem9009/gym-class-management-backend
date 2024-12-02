import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { IUser } from '../models/User';
import mongoose from 'mongoose';


export type RequestWithUser<T = {}> = Request & T;

interface JWTPlayLoadType extends JwtPayload {
    userId: mongoose.Types.ObjectId
}



const verifyJWT = (req: RequestWithUser<{user?: unknown | IUser}>, res: Response, next: NextFunction) : any => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ 
            success: false, 
            message: 'Authorization header missing.' 
        });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ 
            success: false, 
            message: 'Token missing in authorization header.' 
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string)
        req.user = decoded as IUser
        next(); 
    } catch (error) {
        res.status(403).json({ 
            success: false, 
            message: 'Invalid or expired token.' 
        });
    }
};

export default verifyJWT;
