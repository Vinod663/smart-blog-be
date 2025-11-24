//3
import { Router } from 'express'
import { getAllPost, getMyPost, savePost } from '../controllers/post.controller';
import { authenticate } from '../middleware/auth';
import { requireRole } from '../middleware/role';
import { Role } from '../models/User';
import { upload } from '../middleware/upload';
import { generateAIContent } from '../controllers/ai.controller';

const router = Router()

//Protected route (ADMIN, AUTHOR) can create post
router.post(
    "/create", 
    authenticate, 
    requireRole([Role.ADMIN, Role.AUTHOR]), 
    upload.single("image"), //form data with key "image"
    savePost);//http://localhost:3000/api/v1/post/create


//Public route - get all posts
router.get("/", getAllPost);//http://localhost:3000/api/v1/post/


//Proteced route (ADMIN, AUTHOR) can get their own posts
router.get("/me", authenticate, requireRole([Role.ADMIN, Role.AUTHOR]), getMyPost);//http://localhost:3000/api/v1/post/me

router.post("/ai/genarate", generateAIContent);//http://localhost:3000/api/v1/post/ai/genarate




export default router