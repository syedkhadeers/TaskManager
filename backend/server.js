// import express from "express";
// import dotenv from "dotenv";
// import cors from "cors";
// import fs from "fs";
// import connectDB from "./src/config/connect.js";
// import cookieParser from "cookie-parser";
// import errorHandler from "./src/helpers/errorHandler.js";
// import path from "path";
// import { fileURLToPath } from "url";

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 5000;

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// app.use(
//   cors({
//     origin: [process.env.CLIENT_URL, "http://localhost:5173"],
//     credentials: true,
//   })
// );

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());

// // Dynamic route loading
// const routeFiles = fs.readdirSync("./src/routes");

// routeFiles.forEach((file) => {
//   import(`./src/routes/${file}`)
//     .then((route) => {
//       app.use("/api/v1", route.default);
//     })
//     .catch((err) => console.log(`Error loading route: ${err.message}`));
// });

// app.use(errorHandler);

// const startServer = async () => {
//   try {
//     await connectDB();
//     app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
//   } catch (error) {
//     console.error("Failed to start server:", error.message);
//     process.exit(1);
//   }
// };

// startServer();
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url"; // Import fileURLToPath
import errorHandler from "./src/helpers/errorHandler.js";
import connectDB from "./src/config/connect.js";

dotenv.config();
const app = express();
const port = process.env.PORT || 8000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(errorHandler);

// Dynamic route loading
const routeFiles = fs.readdirSync("./src/routes");

routeFiles.forEach((file) => {
  import(`./src/routes/${file}`)
    .then((route) => {
      app.use("/api/v1", route.default);
    })
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