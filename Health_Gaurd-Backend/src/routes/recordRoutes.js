import express from "express";
import {
  createRecord,
  listRecords
} from "../controllers/recordController.js";

const router = express.Router();

// GET /api/records
router.get("/", listRecords);

// POST /api/records
router.post("/", createRecord);

export default router;
