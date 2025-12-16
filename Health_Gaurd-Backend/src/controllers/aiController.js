// // --------------------------------------------------------
// // AI Controller – Health_Guard (Stable Version)
// // --------------------------------------------------------

// import fs from "fs";
// import path from "path";
// import axios from "axios";
// import dotenv from "dotenv";
// import { fileURLToPath } from "url";
// import { createRequire } from "module";

// const require = createRequire(import.meta.url);
// const pdfParse = require("pdf-parse");

// // --------------------------------------------------------
// // ENV SETUP
// // --------------------------------------------------------

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// dotenv.config({ path: path.join(__dirname, "../../.env") });

// const FIREWORKS_API_KEY = process.env.FIREWORKS_API_KEY;
// const FIREWORKS_MODEL =
//   process.env.FIREWORKS_MODEL ||
//   "accounts/fireworks/models/gpt-oss-20b";

// const FIREWORKS_URL =
//   "https://api.fireworks.ai/inference/v1/chat/completions";

// if (!FIREWORKS_API_KEY) {
//   console.warn("⚠️ FIREWORKS_API_KEY missing — AI routes will fail");
// }

// // --------------------------------------------------------
// // FIREWORKS API CALL
// // --------------------------------------------------------

// async function callFireworks(prompt, options = {}) {
//   const response = await axios.post(
//     FIREWORKS_URL,
//     {
//       model: FIREWORKS_MODEL,
//       messages: [{ role: "user", content: prompt }],
//       max_tokens: options.max_tokens ?? 1200,
//       temperature: options.temperature ?? 0.4,
//     },
//     {
//       headers: {
//         Authorization: `Bearer ${FIREWORKS_API_KEY}`,
//         "Content-Type": "application/json",
//       },
//       timeout: 120000,
//     }
//   );

//   return response.data.choices[0].message.content;
// }

// // --------------------------------------------------------
// // SAFE JSON PARSER
// // --------------------------------------------------------

// function extractJson(text) {
//   const cleaned = text
//     .replace(/```json/gi, "")
//     .replace(/```/g, "")
//     .trim();

//   const match = cleaned.match(/\{[\s\S]*\}/);
//   if (!match) throw new Error("No JSON found");

//   return JSON.parse(match[0]);
// }

// // --------------------------------------------------------
// // SIMPLE LAB VALUE EXTRACTOR (OCR)
// // --------------------------------------------------------

// function extractValues(text) {
//   if (!text) return {};

//   // Normalize text
//   const lines = text
//     .replace(/\r/g, "")
//     .split("\n")
//     .map((l) => l.trim())
//     .filter(Boolean);

//   const result = {};

//   const findValue = (patterns) => {
//     for (const line of lines) {
//       for (const p of patterns) {
//         const regex = new RegExp(
//           `${p}[^0-9]*([0-9]+(?:\\.[0-9]+)?)`,
//           "i"
//         );
//         const match = line.match(regex);
//         if (match) return match[1];
//       }
//     }
//     return "";
//   };

//   result.hemoglobin = findValue([
//     "hemoglobin",
//     "\\bhb\\b",
//   ]);

//   result.wbc = findValue([
//     "wbc",
//     "white blood cell",
//   ]);

//   result.platelets = findValue([
//     "platelet",
//     "platelets",
//   ]);

//   result.cholesterol = findValue([
//     "total cholesterol",
//     "\\bcholesterol\\b",
//   ]);

//   result.hdl = findValue([
//     "\\bhdl\\b",
//     "hdl cholesterol",
//   ]);

//   result.ldl = findValue([
//     "\\bldl\\b",
//     "ldl cholesterol",
//   ]);

//   result.triglycerides = findValue([
//     "triglycerides",
//     "\\btg\\b",
//   ]);

//   result.creatinine = findValue([
//     "creatinine",
//   ]);

//   result.urea = findValue([
//     "\\burea\\b",
//   ]);

//   result.tsh = findValue([
//     "\\btsh\\b",
//     "thyroid stimulating hormone",
//   ]);

//   return result;
// }


// // --------------------------------------------------------
// // 1️⃣ OCR CONTROLLER
// // POST /api/ai/upload-report
// // --------------------------------------------------------

// //import fs from "fs";
// //import pdfParse from "pdf-parse";

// /**
//  * NOTE:
//  * - Text PDFs → parsed with pdf-parse
//  * - Scanned PDFs / Images → OCR should be added later
//  * - OCR failure is NOT fatal
//  */
// export const handleOCR = async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ error: "No file uploaded" });
//     }

//     const mime = req.file.mimetype;
//     const buffer = fs.readFileSync(req.file.path);

//     let extractedText = "";

//     /* ---------- CASE 1: TEXT PDF ---------- */
//     if (mime === "application/pdf") {
//       const parsed = await pdfParse(buffer);

//       if (parsed.text && parsed.text.trim().length > 50) {
//         extractedText = parsed.text;
//       } else {
//         // Scanned PDF → no text
//         return res.json({
//           filename: req.file.originalname,
//           parsed_values: {},
//           warning:
//             "Scanned PDF detected. Please upload a JPG/PNG image or enter values manually.",
//         });
//       }
//     }

//     /* ---------- CASE 2: IMAGE ---------- */
//     else if (mime.startsWith("image/")) {
//       // OCR not implemented yet → safe fallback
//       return res.json({
//         filename: req.file.originalname,
//         parsed_values: {},
//         warning:
//           "Image OCR not configured yet. Please enter values manually.",
//       });
//     }

//     /* ---------- UNSUPPORTED ---------- */
//     else {
//       return res.status(400).json({ error: "Unsupported file type" });
//     }

//     /* ---------- PARSE VALUES ---------- */
//     const values = extractValues(extractedText);

//     return res.json({
//       filename: req.file.originalname,
//       parsed_values: values,
//     });
//   } catch (err) {
//     console.error("❌ OCR ERROR:", err);

//     // 🔥 NEVER crash the API
//     return res.json({
//       parsed_values: {},
//       warning:
//         "Could not extract report automatically. Please enter values manually.",
//     });
//   }
// };


// // --------------------------------------------------------
// // 2️⃣ LIFESTYLE ENHANCER
// // POST /api/ai/lifestyle-enhancer
// // --------------------------------------------------------

// export const lifestylePlan = async (req, res) => {
//   try {
//     const input = req.body?.inputData || {};

//     const prompt = `
// You are a medical lifestyle assistant.

// Analyze the data and return a clear, structured lifestyle plan.

// User Data:
// ${JSON.stringify(input, null, 2)}

// Sections:
// - Health Summary
// - Diet Plan
// - Fitness Plan
// - Environmental Advice
// - Risk Precautions
// - Disclaimer

// Rules:
// - Avoid medicines
// - Be concise
// - Bullet points preferred
// `;

//     const reply = await callFireworks(prompt, { max_tokens: 900 });

//     return res.json({ report: reply });
//   } catch (err) {
//     console.error("❌ LIFESTYLE ERROR:", err);
//     return res.status(500).json({ error: "Lifestyle analysis failed" });
//   }
// };

// // ===============================
// // 🔧 Helper functions (HERE)
// // ===============================

// export function extractJson(text) {
//   // 🔒 HARD GUARD
//   if (!text || typeof text !== "string") {
//     return null;
//   }

//   try {
//     const cleaned = text.trim();
//     const match = cleaned.match(/\{[\s\S]*\}/);
//     if (!match) return null;
//     return JSON.parse(match[0]);
//   } catch {
//     return null;
//   }
// }


// // --------------------------------------------------------
// // 3️⃣ SYMPTOM CHECKER (STRICT JSON + RETRY)
// // POST /api/ai/symptom-checker
// // --------------------------------------------------------

// export const symptomCheck = async (req, res) => {
//   const fallback = { conditions: [] };

//   try {
//     const message = req.body?.message?.trim();
//     if (!message) return res.json({ response: fallback });

//     const prompt = `
// Return ONLY valid JSON.
// NO text outside JSON.

// {
//   "conditions": [
//     { "name": "", "probability": "Low|Medium|High", "reason": "" }
//   ]
// }

// Symptoms:
// ${message}
// `;

//     const reply = await callFireworks(prompt, {
//       max_tokens: 250,
//       timeout: 8000,
//     });

//     const parsed = extractJson(reply);

//     if (!parsed || !Array.isArray(parsed.conditions)) {
//       return res.json({ response: fallback });
//     }

//     return res.json({ response: parsed });
//   } catch (err) {
//     console.error("SYMPTOM CHECK ERROR:", err);
//     return res.json({ response: fallback });
//   }
// };


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
jzbbjs