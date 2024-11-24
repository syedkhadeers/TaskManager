import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host} at ${conn.connection.port} with DB Name ${conn.connection.name}`);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

export default connectDB;