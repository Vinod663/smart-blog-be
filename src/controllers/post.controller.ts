import { Request, Response } from 'express';
import cloudinary from '../config/cloudinary';
import { upload } from '../middleware/upload';
import { Post } from '../models/Post';
import { AuthRequest } from '../middleware/auth';



export const savePost = async(req: AuthRequest, res: Response) => {
    // req.file?.buffer -> meken file eke onim data ekk eliyt gnn puluwan

    try {
        const {title, content, tags} = req.body

        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" })
        }

        let imageURL = ''

        if (req.file) {
            const result: any = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    { folder: 'smart-blog/posts' },
                    (error, result) => {
                        if (error) {
                            return reject(error)
                        } else {
                            resolve(result)
                        }
                    }
                )

                uploadStream.end(req.file?.buffer)
            })
            imageURL = result?.secure_url
        }

        const newPost = new Post({
            title,
            content,
            tags: tags.split(','), // tags eka comma separated string ekak widiyta enwa. array ekk widiyt db eke save wenw. "mobile,tech,news" => ["mobile", "tech", "news"]
            imageURL,
            author: req.user.sub // from auth middleware eke user object ekta add krpu id eka gnnwa
        })

        // save post to DB with imageURL
        await newPost.save()

        res.status(201).json({ message: 'Post created successfully', data: newPost })

    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Fail to save post' })
    }
}



// export const getAllPost = async(req: Request, res: Response) => {
//     try {
//     // Pagination
//     const page = parseInt(req.query.page as string) | 1;
//     const limit = parseInt(req.query.limit as string) | 10;
//     const skip = (page - 1) * limit;

//     const posts = await Post.find()
//       .populate('author', 'firstName email')
//       .sort({ createdAt: -1 })
//       .skip(skip)
//       .limit(limit);

//     const total = await Post.countDocuments();
//     return res.status(200).json({
//       message: 'Posts data',
//       data: posts,
//       totalPages: Math.ceil(total / limit),
//       totalCount: total,
//       page,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Failed to get post.!' });
//   }
// }

//http://localhost:5000/api/post?page=2&limit=5
export const getAllPost = async(req: Request, res: Response) => {
    // Pagination page  limit
    //use query params
    try{
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;
        
        const posts= await Post.find()
        .populate('author', 'email')//related model data
        .sort({ createdAt: -1 })//descending order
        .skip(skip)//ignore data for pagination
        .limit(limit)//data count for currently need 

        const total = await Post.countDocuments();

        res.status(200).json({
            message: 'Posts data',
            data: posts,
            totalPages: Math.ceil(total / limit) ,// devide total count with limit and round it to upper number
            totalCount: total,
            page,
        });
    }
    catch(err){
        console.error(err);
        res.status(500).json({ message: 'Failed to get post.!' });
    }
}

export const getMyPost = async (req: AuthRequest, res: Response) => {//Use for  get own posts

    try{
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;
        
        const posts= await Post.find({ author: req.user.sub })
        .sort({ createdAt: -1 })//descending order
        .skip(skip)//ignore data for pagination
        .limit(limit)//data count for currently need 

        const total = await Post.countDocuments();

        res.status(200).json({
            message: 'Posts data',
            data: posts,
            totalPages: Math.ceil(total / limit) ,// devide total count with limit and round it to upper number
            totalCount: total,
            page,
        });
    }
    catch(err){
        console.error(err);
        res.status(500).json({ message: 'Failed to get post.!' });
    }
}