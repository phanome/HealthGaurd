// --------------------------------------------------------
// Fireworks.ai Powered AI Controller (Production Safe)
// --------------------------------------------------------

import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import axios from "axios";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

// --------------------------------------------------------
// ENV SETUP
// --------------------------------------------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../../.env") });

const FIREWORKS_API_KEY = process.env.FIREWORKS_API_KEY;
const FIREWORKS_MODEL =
  process.env.FIREWORKS_MODEL ||
  "accounts/fireworks/models/llama-v3-8b-instruct";

const FIREWORKS_URL =
  "https://api.fireworks.ai/inference/v1/chat/completions";

if (!FIREWORKS_API_KEY) {
  console.warn("⚠️ FIREWORKS_API_KEY missing — AI routes will fail");
}

// --------------------------------------------------------
// FIREWORKS CALL WRAPPER
// --------------------------------------------------------
async function callFireworks(prompt, options = {}) {
  const response = await axios.post(
    FIREWORKS_URL,
    {
      model: FIREWORKS_MODEL,
      messages: [{ role: "user", content: prompt }],
      max_tokens: options.max_tokens ?? 1200,
      temperature: options.temperature ?? 0.4, // lower = more deterministic JSON
    },
    {
      headers: {
        Authorization: `Bearer ${FIREWORKS_API_KEY}`,
        "Content-Type": "application/json",
      },
      timeout: 120000,
    }
  );

  return response.data.choices[0].message.content;
}

// --------------------------------------------------------
// SAFE JSON EXTRACTOR
// --------------------------------------------------------
function extractJson(text) {
  const cleaned = text
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  const match = cleaned.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("No JSON found");

  return JSON.parse(match[0]);
}

// --------------------------------------------------------
// LAB VALUE EXTRACTION (OCR)
// --------------------------------------------------------
function extractValues(text) {
  const get = (label) => {
    const regex = new RegExp(`${label}[\\s:\\-]*([0-9]+(?:\\.[0-9]+)?)`, "i");
    const match = text.match(regex);
    return match ? match[1] : "";
  };

  return {
    hemoglobin: get("hemoglobin|hb"),
    wbc: get("wbc"),
    platelets: get("platelet|platelets"),
    cholesterol: get("cholesterol"),
    hdl: get("\\bhdl\\b"),
    ldl: get("\\bldl\\b"),
    triglycerides: get("triglycerides|tg"),
    creatinine: get("creatinine"),
    urea: get("\\burea\\b"),
    tsh: get("\\btsh\\b"),
  };
}

// --------------------------------------------------------
// 1️⃣ OCR HANDLER
// POST /api/ai/upload-report
// --------------------------------------------------------
export const handleOCR = async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ error: "No file uploaded" });

    if (!req.file.originalname.toLowerCase().endsWith(".pdf"))
      return res.status(400).json({ error: "Only PDF files supported" });

    const buffer = fs.readFileSync(req.file.path);
    const parsed = await pdfParse(buffer);

    const text = parsed?.text ?? "";
    const values = extractValues(text);

    return res.json({
      filename: req.file.originalname,
      raw_text: text,
      parsed_values: values,
    });
  } catch (err) {
    console.error("OCR ERROR:", err);
    return res.status(500).json({ error: "OCR failed" });
  }
};

// --------------------------------------------------------
// 2️⃣ LIFESTYLE ANALYZER
// POST /api/ai/lifestyle-enhancer
// --------------------------------------------------------
export const lifestylePlan = async (req, res) => {
  try {
    const input = req.body?.inputData ?? {};

    const prompt = `
You are a medical lifestyle assistant.

Analyze the data and return a concise, well-structured plan.

User Data:
${JSON.stringify(input, null, 2)}

Sections:
- Health Summary
- Diet Plan
- Fitness Plan
- Environmental Advice
- Risk Precautions
- Disclaimer

Keep explanations concise.
Avoid medications.
`;

    const report = await callFireworks(prompt, { max_tokens: 900 });

    return res.json({ report });
  } catch (err) {
    console.error("LIFESTYLE ERROR:", err);
    return res.status(500).json({ error: "Lifestyle analysis failed" });
  }
};

// --------------------------------------------------------
// 3️⃣ SYMPTOM CHECKER (STRICT + RETRY SAFE)
// POST /api/ai/symptom-checker
// --------------------------------------------------------
export const symptomCheck = async (req, res) => {
  try {
    const message = req.body?.message ?? "";

    const basePrompt = `
You are a medical AI assistant.

Return ONLY valid JSON.
No markdown. No extra text.

Rules:
- Keep all text concise.
- Remedy descriptions max 20 words.
- Do not exceed necessary detail.

Format:
{
  "conditions": [
    { "name": "", "probability": "", "reason": "" }
  ],
  "tests": [
    { "name": "", "reason": "" }
  ],
  "remedies": [
    { "name": "", "description": "" }
  ],
  "doctor": {
    "when_to_visit": ""
  },
  "disclaimer": ""
}

Symptoms:
${message}
`;

    // ---------- FIRST TRY ----------
    const reply = await callFireworks(basePrompt, { max_tokens: 1200 });

    let parsed;
    try {
      parsed = extractJson(reply);
      return res.json({ response: parsed });
    } catch (err) {
      console.warn("⚠️ JSON truncated, retrying with shorter prompt");
    }

    // ---------- RETRY (SHORTER PROMPT) ----------
    const retryPrompt = `
Return ONLY valid JSON in the same format.
Keep responses extremely short.
No explanations.

Symptoms:
${message}
`;

    const retryReply = await callFireworks(retryPrompt, { max_tokens: 800 });

    try {
      parsed = extractJson(retryReply);
      return res.json({ response: parsed });
    } catch (retryErr) {
      console.error("❌ AI FAILED TWICE. RAW RESPONSE:\n", retryReply);
      return res.status(500).json({
        error: "AI response incomplete. Please retry.",
      });
    }

  } catch (err) {
    console.error("SYMPTOM CHECK ERROR:", err);
    return res.status(500).json({ error: "Symptom check failed" });
  }
};
