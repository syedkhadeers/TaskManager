const corsOptions = {
  origin: [
    process.env.FRONTEND_URL || "http://localhost:5173",
    process.env.BACKEND_URL || "http://localhost:8000",
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Accept"],
  exposedHeaders: ["set-cookie"],
};

export default corsOptions;
