//auth.ts
//auth.middlewares.ts
//authMiddleware.ts
import { NextFunction,Request,Response } from "express"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as string;

export interface AuthRequest extends Request {
    user?: any;//you can define a more specific type based on your payload structure
}


export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
    //dummy authentication middleware
    const authHeader = req.headers.authorization;

    if(!authHeader){
        return res.status(401).json({ message: "No token provided" });
    }

    //Bearer fniehrigehrgiherg
    const token = authHeader.split(" ")[1];// ["Bearer", "fniehrigehrgiherg"]

    try{
        const payload = jwt.verify(token, JWT_SECRET);
        req.user = payload;//attach payload to req object
        next();
    }
    catch(err){
        return res.status(403).json({ message: "Invalid token" });
    }
}