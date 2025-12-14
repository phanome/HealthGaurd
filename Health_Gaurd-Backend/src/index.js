// src/index.js
// ----------------------------------------------------
// MAIN SERVER ENTRY POINT (USE THIS FILE ONLY)
// ----------------------------------------------------

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import { fileURLToPath } from "url";
import path from "path";
import cookieParser from "cookie-parser";

// Fix __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env file (project root)
dotenv.config({ path: path.join(__dirname, "../.env") });

// ---------------------
// ENVIRONMENT CHECKS
// ---------------------
console.log("ENV → FIREWORKS_API_KEY:", process.env.FIREWORKS_API_KEY ? "YES" : "NO");
console.log("ENV → FIREWORKS_MODEL:", process.env.FIREWORKS_MODEL || "MISSING");
console.log("ENV → MONGO_URI:", process.env.MONGO_URI ? "YES" : "NO");

// Frontend URL
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:5173";
console.log("FRONTEND_ORIGIN:", FRONTEND_ORIGIN);

// Init app
const app = express();

// ----------------- MIDDLEWARE -----------------
app.use(morgan("dev"));

// CORS (supports cookies for frontend)
app.use(
  cors({
    origin: FRONTEND_ORIGIN,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);

// JSON + URLENCODED
app.use(express.json({ limit: "2mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "2mb" }));

// Cookie parser
app.use(cookieParser());

// ----------------- DATABASE -----------------
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`🟢 MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error("🔴 MongoDB Error:", err.message);
    process.exit(1);
  }
};

// ----------------- ROUTES -----------------
import authRoutes from "./routes/authRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import recordRoutes from "./routes/recordRoutes.js";

app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/records", recordRoutes);

// Root health check
app.get("/", (req, res) => {
  res.json({ message: "Health_Gaurd backend running 🚀 (Fireworks AI Enabled)" });
});

// ----------------- GLOBAL ERROR HANDLER -----------------
app.use((err, req, res, next) => {
  console.error("🔥 SERVER ERROR:", err.stack || err);
  res.status(err?.status || 500).json({
    error: err?.message || "Internal server error",
  });
});

// ----------------- START SERVER -----------------
const PORT = process.env.PORT || 8080;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
    console.log(`🌐 CORS allowed: ${FRONTEND_ORIGIN}`);
    console.log("🔥 Fireworks AI Integration Active");
  });
};

startServer();
