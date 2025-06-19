import mongoose from "mongoose";

const connectDB = async()=>{

    mongoose.connection.on('connected',()=>{
        console.log("DB connected");
        
    })

    // Use MONGO_URI from .env file instead of MONGODB_URI
    const connectionString = process.env.MONGO_URI;
    
    if (!connectionString) {
        console.error("MONGO_URI is not defined in environment variables");
        process.exit(1);
    }
    
    try {
        await mongoose.connect(connectionString);
    } catch (error) {
        console.error("MongoDB connection error:", error.message);
        process.exit(1);
    }
}

export default connectDB;