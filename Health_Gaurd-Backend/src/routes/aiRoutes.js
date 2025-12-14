// src/routes/aiRoutes.js
import express from "express";
import multer from "multer";
import { handleOCR, lifestylePlan, symptomCheck } from "../controllers/aiController.js";

const router = express.Router();

// ------------------------------
// Multer: store uploads in /uploads
// ------------------------------
const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB limit
});

// ------------------------------
// OCR: Upload PDF or Image
// POST /api/ai/upload-report
// ------------------------------
router.post("/upload-report", upload.single("file"), handleOCR);

// ------------------------------
// Lifestyle Enhancer
// POST /api/ai/lifestyle-enhancer
// ------------------------------
router.post("/lifestyle-enhancer", lifestylePlan);

// ------------------------------
// Symptom Checker
// POST /api/ai/symptom-checker
// ------------------------------
router.post("/symptom-checker", symptomCheck);

export default router;
