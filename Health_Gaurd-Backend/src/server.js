// ----------------------------------------------------
// SERVER.JS (FINAL, CLEAN, FULLY WORKING VERSION)
// ----------------------------------------------------

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import { fileURLToPath } from "url";
import path from "path";

// -----------------------------
// Resolve __dirname in ES Modules
// -----------------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// -----------------------------
// Load Environment Variables
// -----------------------------
dotenv.config({ path: path.join(__dirname, "../.env") });

console.log("🔧 ENV CHECK:");
console.log(" - JWT_SECRET:", process.env.JWT_SECRET ? "LOADED" : "MISSING");
console.log(" - MONGO_URI:", process.env.MONGO_URI ? "LOADED" : "MISSING");

// -----------------------------
// Initialize Express
// -----------------------------
const app = express();

// -----------------------------
// Middleware
// -----------------------------
app.use(
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true,
  })
);

app.use(express.json({ limit: "25mb" }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));

// -----------------------------
// Connect to MongoDB
// -----------------------------
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("🟢 MongoDB Connected Successfully");
  } catch (err) {
    console.error("🔴 MongoDB Connection Error:", err.message);
    process.exit(1);
  }
};

// -----------------------------
// Import Routes
// -----------------------------
import authRoutes from "./routes/authRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import recordRoutes from "./routes/recordRoutes.js";

// -----------------------------
// Register Routes
// -----------------------------
app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/records", recordRoutes);

// -----------------------------
// Root Endpoint
// -----------------------------
app.get("/", (req, res) => {
  res.json({ message: "Health_Gaurd Node Backend Running 🚀" });
});

// -----------------------------
// Error Handler
// -----------------------------
app.use((err, req, res, next) => {
  console.error("🔥 SERVER ERROR:", err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

// -----------------------------
// Start Server
// -----------------------------
const PORT = process.env.PORT || 5501;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
};

startServer();
