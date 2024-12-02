import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";

interface IRequest extends Request {
    user?: {role : string, id : string} | JwtPayload;
}


  const checkRole = (roles: string[]) : any => {
    return (req: IRequest, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(403).json({ success: false, message: 'No user information found' });
        }
    
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ success: false, message: 'Forbidden' });
        }
    
        next(); 
    };
  };

export default checkRole