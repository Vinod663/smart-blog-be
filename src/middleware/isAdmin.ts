//auth.ts
//auth.middlewares.ts
//authMiddleware.ts
import { NextFunction,Request,Response } from "express"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import { Role } from "../models/User";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as string;

export interface AuthRequest extends Request {
    user?: any;//you can define a more specific type based on your payload structure
}


export const authenticateAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
    //dummy authentication middleware
    const authHeader = req.headers.authorization;

    if(!authHeader){
        return res.status(401).json({ message: "No token provided" });
    }

    //Bearer fniehrigehrgiherg
    const token = authHeader.split(" ")[1];// ["Bearer"//0, "fniehrigehrgiherg"//1]

    try{
        const payload = jwt.verify(token, JWT_SECRET);
        req.user = payload;//attach payload to req object

        if(!req.user.roles.includes(Role.ADMIN)){
            return res.status(403).json({ message: "You do not have permission to access this resource because you are not an admin" });
        }

        next();
    }
    catch(err){
        return res.status(403).json({ message: "Invalid token" });
    }
}