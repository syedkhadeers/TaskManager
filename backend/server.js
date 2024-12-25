import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import errorHandler from "./src/helpers/errorHandler.js";
import connectDB from "./src/config/connect.js";

dotenv.config();
const app = express();
const port = process.env.PORT || 8000;

const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
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
