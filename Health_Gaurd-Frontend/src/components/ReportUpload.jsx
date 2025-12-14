import React, { useState } from "react";
import { UploadCloud, FileText, Loader2 } from "lucide-react";
import api from "../api/api";

/**
 * ReportUpload
 * Props:
 *  - onExtract(parsedValues: object)
 *
 * Behavior:
 *  - POST multipart/form-data to /api/ai/upload-report
 *  - Calls onExtract(parsed_values) when successful
 *  - DOES NOT display raw OCR preview (per your request)
 */
export default function ReportUpload({ onExtract }) {
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setLoading(true);

    const fd = new FormData();
    fd.append("file", file);

    try {
      const res = await api.post("/ai/upload-report", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Expecting { parsed_values: { ... } }
      const parsed = res.data?.parsed_values || {};
      onExtract(parsed);
    } catch (err) {
      console.error("Upload error:", err);
      alert(
        (err?.response?.data && err.response.data.error) ||
          "Failed to process report. Try a clean scan (PDF or JPG)."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-6 mb-8">
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 bg-indigo-50 rounded-md">
          <FileText className="w-5 h-5 text-indigo-600" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900">Upload Medical Report</h3>
      </div>

      <label
        className="block cursor-pointer select-none rounded-lg border-2 border-dashed border-slate-300 p-6 text-center hover:border-indigo-400 hover:bg-indigo-50/30 transition"
      >
        <div className="flex flex-col items-center gap-3">
          <UploadCloud className="w-10 h-10 text-slate-500" />
          <div className="text-sm text-slate-600">
            {fileName || "Click to upload a PDF / JPG / PNG"}
          </div>
          <div className="text-xs text-slate-400">High-contrast scans work best</div>
        </div>

        <input
          type="file"
          accept=".pdf,.png,.jpg,.jpeg"
          onChange={handleFile}
          className="hidden"
        />
      </label>

      {loading && (
        <div className="mt-4 flex items-center gap-2 text-indigo-600">
          <Loader2 className="animate-spin w-4 h-4" />
          Processing report — extracting key lab values...
        </div>
      )}
    </div>
  );
}
