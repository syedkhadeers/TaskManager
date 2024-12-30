import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import errorHandler from "./src/helpers/errorHandler.js";
import connectDB from "./src/config/connect.js";
import corsOptions from "./src/config/corsOptions.js";

dotenv.config();
const app = express();
const port = process.env.PORT || 8000;

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// app.use(
//   cors({
//     origin: process.env.CLIENT_URL || "http://localhost:5173",
//     withCredentials: true,
//   })
// );

// app.use(
//   cors({
//     origin: [
//       process.env.FRONTEND_URL || "http://localhost:5173",
//       process.env.BACKEND_URL || "http://localhost:8000",
//     ],
//     withCredentials: true, // This must be true to allow cookies
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//     maxAge: 3600, // 1 hour
//   })
// );
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(errorHandler);

// Load routes dynamically
fs.readdirSync("./src/routes").forEach((file) => {
  import(`./src/routes/${file}`)
    .then((route) => app.use("/api/v1", route.default))
    .catch((err) => console.log(`Error loading route: ${err.message}`));
});

const startServer = async () => {
  try {
    await connectDB();
    app.listen(port, () => console.log(`Server running on port ${port}`));
  } catch (error) {
    console.error(`Error starting server: ${error.message}`);
    process.exit(1);
  }
};

startServer();
