//2-ii
//handle requests and responses for authentication-related operations
import {Request, Response} from 'express'
import { Role, Status } from '../models/User';
import { User } from '../models/User';
import bcrypt from 'bcryptjs';
import { signAccessToken, signRefreshToken } from '../utills/tokens';
import Jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as string;

export const register = async (req: Request, res: Response) => {
    try{
        const {firstname, lastname, email, password, role} = req.body;

        //data validation
        if(!firstname || !lastname || !email || !password || !role){
            return res.status(400).json({ message: 'All fields are required' })
        }

        if (role !== Role.USER && role !== Role.AUTHOR) {
            return res.status(400).json({ message: 'Invalid role' })
        }

       const existingUser = await User.findOne({ email });

       if(existingUser){
           return res.status(400).json({ message: 'Email already exists' })
       }

       const hashedPassword = await bcrypt.hash(password, 10);

       const approvedStatus = role === Role.USER ? Status.PENDING : Status.APPROVED;

       const newUser = new User({
        //firstname : firstname,
           firstname,
           lastname,
           email,
           password: hashedPassword,
           roles: [role],
           approved: approvedStatus
       });

       await newUser.save();// await makes the function wait until the promise is resolved

       res.status(201).json({ 
        message: role === Role.AUTHOR
         ? 'Author registered successfully'
            : 'User registered successfully',

        data: {
            id: newUser._id,
            firstname: newUser.firstname,
            lastname: newUser.lastname,
            email: newUser.email,
            roles: newUser.roles,
            approved: newUser.approved
        }
       });

    }catch(err:any){
        res.status(500).json({ message : err?.message })
    }

}



    



export const login = async (req: Request, res: Response) => {
    try{
        const { email, password } = req.body;

        //data validation
        if(!email || !password){
            return res.status(400).json({ message: 'Email and password are required' })
        }

        const user = await User.findOne({ email });

        if(!user){
            return res.status(401).json({ message: 'Invalid email or password' })
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if(!isPasswordValid){
            return res.status(401).json({ message: 'Invalid email or password' })
        }


        //generate token
        const accessToken = signAccessToken(user);
        const refreshToken = signRefreshToken(user);

        res.status(200).json({ 
            message: 'Login successful',
            data: {
                // id: user._id,
                // firstname: user.firstname,
                // lastname: user.lastname,
                email: user.email,
                roles: user.roles,
                //token
                accessToken,
                refreshToken
                
            }
         })
    }
    catch(err:any){
        res.status(500).json({ message : err?.message })
    }
}   



export const getMe = async (req: Request, res: Response) => {
    try{
       const {sub: userId, roles} = (req as any).user;//AuthRequest

       if(!userId || !roles){
           return res.status(401).json({ message: 'Unauthorized' })
       }

       const user = await User.findById(userId);

       if(!user){
           return res.status(404).json({ message: 'User not found' })
       }

       res.status(200).json({ message: 'User information retrieved successfully', data: user })
    }
    catch(err:any){
        res.status(500).json({ message : err?.message })
    }

    // res.status(200).json({ message: 'User information retrieved successfully' })
}

export const registerAdmin = async(req: Request, res: Response) => {
    try{
        const { firstname, lastname, email, password, role } = req.body;
        // Implement admin registration logic here

        //data validation
        if(!firstname || !lastname || !email || !password){
            return res.status(400).json({ message: 'All fields are required' })
        }

        if(role !== Role.ADMIN){
            return res.status(400).json({ message: 'Invalid role' })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            firstname,
            lastname,
            email,
            password: hashedPassword,
            roles: [Role.ADMIN],
            approved: Status.APPROVED
        });

        await newUser.save();

        res.status(201).json({ message: 'Admin registered successfully' })
    }
    catch(err:any){
        res.status(500).json({ message : err?.message })
    }
}


export const handleRefreshToken = async(req: Request, res: Response) => {
    try{
        const { token } = req.body;

        if(!token){
            return res.status(400).json({ message: 'Refresh token is required' })
        }

        //verify refresh token
        const payload = Jwt.verify(token, JWT_REFRESH_SECRET)
        // payload.sub;//userId
        const user = await User.findById(payload.sub);

        if(!user){
            return res.status(403).json({ message: 'Invalid refresh token' })
        }

        const accessToken = signAccessToken(user);
        res.status(200).json({
            accessToken
        })

        //generate new access token

        res.status(200).json({ 
            message: 'New access token generated successfully',
            data: {
                accessToken: 'newAccessTokenHere'
            }
         })
    }
    catch(err:any){
        res.status(500).json({ message : err?.message })
    }
}