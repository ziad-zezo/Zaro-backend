import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();
const dbPassword = process.env.MONGODB_PASSWORD;
const connectDB = async () => {
    try {
        mongoose.connect(`mongodb+srv://ziadmohshahien3_db_user:${dbPassword}@cluster0.mjmqrsw.mongodb.net/?appName=Cluster0`);
        console.log("MongoDB connected");
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

export default connectDB; 
