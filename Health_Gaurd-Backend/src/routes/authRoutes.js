import express from "express";
import { signup, login, currentUser } from "../controllers/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// PUBLIC ROUTES
router.post("/signup", signup);
router.post("/login", login);

// PROTECTED ROUTES
router.get("/me", authMiddleware, currentUser);

export default router;
