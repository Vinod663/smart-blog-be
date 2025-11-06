
//Use for connect auth routes to main app and define auth endpoints

import {Request, Response, Router } from "express";
import { login, register, getMe, registerAdmin } from "../controllers/authController";

export const router = Router();


// router.post("/api/v1/auth/register", (req: Request, res: Response) => {//http://localhost:3000/api/v1/auth/register
    
// });


// router.post("/api/v1/auth/login", (req: Request, res: Response) => {//http://localhost:3000/api/v1/auth/login
    
// });


// router.get("/api/v1/auth/me", (req: Request, res: Response) => {//http://localhost:3000/api/v1/auth/me
    
// });


// router.post("/api/v1/auth/admin/register", (req: Request, res: Response) => {//http://localhost:3000/api/v1/auth/admin/register
    
// });



