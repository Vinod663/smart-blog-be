//3
import { Router, Request, Response } from 'express'
import { register, login, getMe, registerAdmin } from '../controllers/authController'
import { authenticate } from '../middleware/auth';
import { authenticateAdmin } from '../middleware/isAdmin';

const router = Router()

router.post("/register", register);//http://localhost:3000/api/v1/auth/register //register as Author or User
router.post("/login", login);//http://localhost:3000/api/v1/auth/login

//protected route(USER, ADMIN,AUTHOR)
router.get("/me", authenticate, getMe);//http://localhost:3000/api/v1/auth/me

////protected route(Admin only)
//need create middleware for role based authorization
router.post("/admin/register",authenticateAdmin, registerAdmin);//http://localhost:3000/api/v1/auth/admin/register

export default router