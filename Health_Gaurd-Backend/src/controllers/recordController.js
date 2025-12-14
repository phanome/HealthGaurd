import Record from "../models/Record.js";

// GET /api/records
export const listRecords = async (req, res, next) => {
  try {
    // Accept optional ?limit=10
    const limit = parseInt(req.query.limit || "50", 10);
    const records = await Record.find().sort({ createdAt: -1 }).limit(limit).lean();
    // Return as array
    res.json(records);
  } catch (err) {
    next(err);
  }
};

// POST /api/records
export const createRecord = async (req, res, next) => {
  try {
    const payload = req.body || {};
    // minimal sanitization
    const record = await Record.create(payload);
    res.status(201).json(record);
  } catch (err) {
    next(err);
  }
};
