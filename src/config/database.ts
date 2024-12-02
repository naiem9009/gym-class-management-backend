import mongoose from "mongoose";
import env from "./globalEnv";


// database connect
const dbConnect = async () => {
    await mongoose.connect(env.MONGO_URI as string)
    console.log("Database is connected");
    
}


export default dbConnect
