import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import fs from "node:fs";
import connectDB from "./src/config/connect.js";
import cookieParser from "cookie-parser";
import errorHandler from "./src/helpers/errorHandler.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

// Middleware
const allowedOrigins = [
  process.env.CLIENT_URL, // This will be http://localhost:3000
  "http://localhost:5173", // Add this line to allow requests from http://localhost:5173
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(errorHandler);

// Routes
const routeFiles = fs.readdirSync("./src/routes");

routeFiles.forEach((file) => {
  import(`./src/routes/${file}`)
    .then((route) => {
      app.use("/api/v1", route.default);
    })
    .catch((err) => console.log(`Error loading route: ${err.message}`));
});

const server = async () => {
  try {
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  } catch (error) {
    console.log("Failed to start server", error.message);
    process.exit(1);
  }
};

connectDB();
server();
