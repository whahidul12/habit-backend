import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        const uri = process.env.MONGODB_URI;
        if (!uri) throw new Error("MongoDB uri is not defined");
        const connection = await mongoose.connect(uri);
        console.log(`MongoDB connected: ${connection.connection.host}`);
    } catch (err) {
        console.error(`MongoDB connection error: ${err.message}`);
        process.exit(1);
    }
}

