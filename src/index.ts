//1
import express from 'express'                   
import cors from 'cors'     
import authRoutes from './routes/authRoutes' 
import dotenv from 'dotenv' 
import mongoose from 'mongoose'
dotenv.config()   

const SERVER_PORT = process.env.SERVER_PORT 
const MONGO_URI = process.env.MONGO_URI as string

const app = express()

app.use(express.json())                         


app.use(cors({
    origin: 'http://localhost:5173',            
    methods: ['GET', 'POST', 'PUT', 'DELETE'],  
}))  

app.use('/api/v1/auth', authRoutes)


//then--> successful connection
//catch--> error in connection
mongoose.connect(MONGO_URI)
.then(() => {
        console.log("Connected to MongoDB")
    }
)
.catch((error) => {-
    console.error("Error connecting to MongoDB:", error)
    process.exit(1)//exit the application with failure code
})



app.listen(SERVER_PORT, () => {
  console.log("Server is running on port " + SERVER_PORT)
})