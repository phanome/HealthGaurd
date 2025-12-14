import express from "express";
import { getMe } from "../controllers/userController.js";
const router = express.Router();

// For now, no auth — returns demo user or real user if later implemented
router.get("/", getMe);

export default router;
