import express, { Request, Response } from 'express';
// create app
const app = express();

import morgan from "morgan"
import cors from "cors"

// routes imports
import authRoutes from './routes/authRoutes';
import classRoutes from './routes/classScheduleRoutes';
import userRoutes from './routes/userRoutes';
import trainerRoutes from './routes/trainerRoute';






// middlewares
app.use(morgan("dev"))
app.use(cors({
    origin: 'http://gym-class-management.vercel.app',
    credentials: true
}));
app.use(express.json())
app.use(express.urlencoded({extended : false}))



app.get("/", (req:Request, res:Response) => {
    res.json({message: "API Working"})
})



// routes setup
app.use('/api/auth', authRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/users', userRoutes);
app.use("/api/trainers", trainerRoutes)








export default app;
