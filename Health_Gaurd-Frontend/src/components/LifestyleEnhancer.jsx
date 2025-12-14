import React, { useState } from "react";
import { motion } from "framer-motion";
import api from "../api/api";
import ReportUpload from "./ReportUpload";
import {
  ChevronRight,
  ChevronLeft,
  Save,
  Activity,
  Leaf,
  Dna,
  FileBarChart,
  Loader2,
} from "lucide-react";
import ReactMarkdown from "react-markdown";

/* Small reusable input */
const InputField = ({ label, name, value, onChange, unit, placeholder = "" }) => (
  <div className="space-y-1">
    <label className="text-xs text-slate-600 font-medium">{label}</label>
    <div className="relative">
      <input
        name={name}
        value={value ?? ""}
        onChange={onChange}
        placeholder={placeholder || "0.00"}
        className="w-full rounded-md border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        inputMode="decimal"
      />
      {unit && <span className="absolute right-3 top-2 text-xs text-slate-400">{unit}</span>}
    </div>
  </div>
);

export default function LifestyleEnhancer() {
  const [step, setStep] = useState(1);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [report, setReport] = useState("");

  const [formData, setFormData] = useState({
    blood_hemoglobin: "",
    blood_wbc: "",
    blood_platelets: "",
    blood_fbs: "",
    blood_hba1c: "",
    lipid_cholesterol: "",
    lipid_hdl: "",
    lipid_ldl: "",
    lipid_triglycerides: "",
    lft_sgpt: "",
    lft_sgot: "",
    lft_bilirubin: "",
    kft_creatinine: "",
    kft_urea: "",
    kft_egfr: "",
    thyroid_tsh: "",
    vit_d: "",
    vit_b12: "",
    env_aqi: "",
    env_water_tds: "",
    env_uv_index: "",
    calories_intake_avg: "",
    calories_burn_avg: "",
    family_history: "",
  });

  // merge OCR parsed values into form
  const handleOcrExtract = (parsedValues = {}) => {
    // Normalize keys: backend returns keys matching these names
    setFormData((prev) => ({ ...prev, ...parsedValues }));
    // move user to step 2 automatically if you like:
    // setStep(2);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const generatePlan = async () => {
    setIsAnalyzing(true);
    try {
      const res = await api.post("/ai/lifestyle-enhancer", { inputData: formData });
      // Expecting { report: markdownString }
      setReport(res.data.report || "");
      setStep(5);
    } catch (err) {
      console.error("Lifestyle API error:", err);
      alert("Failed to generate lifestyle plan. Check backend logs.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const stepContent = () => {
    switch (step) {
      case 1:
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-50 rounded-md"><Activity className="w-5 h-5 text-indigo-600" /></div>
              <div>
                <h3 className="text-lg font-semibold">Blood Profile</h3>
                <p className="text-sm text-slate-500">Complete blood count, sugar and lipid profile</p>
              </div>
            </div>

            <ReportUpload onExtract={handleOcrExtract} />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-4">
                <InputField label="Hemoglobin" name="blood_hemoglobin" value={formData.blood_hemoglobin} onChange={handleChange} unit="g/dL" />
                <InputField label="WBC Count" name="blood_wbc" value={formData.blood_wbc} onChange={handleChange} unit="/µL" />
                <InputField label="Platelets" name="blood_platelets" value={formData.blood_platelets} onChange={handleChange} unit="10³/µL" />
              </div>

              <div className="space-y-4">
                <InputField label="Fasting Blood Sugar (FBS)" name="blood_fbs" value={formData.blood_fbs} onChange={handleChange} unit="mg/dL" />
                <InputField label="HbA1c" name="blood_hba1c" value={formData.blood_hba1c} onChange={handleChange} unit="%" />
              </div>

              <div className="space-y-4">
                <InputField label="Total Cholesterol" name="lipid_cholesterol" value={formData.lipid_cholesterol} onChange={handleChange} unit="mg/dL" />
                <InputField label="HDL" name="lipid_hdl" value={formData.lipid_hdl} onChange={handleChange} unit="mg/dL" />
                <InputField label="LDL" name="lipid_ldl" value={formData.lipid_ldl} onChange={handleChange} unit="mg/dL" />
                <InputField label="Triglycerides" name="lipid_triglycerides" value={formData.lipid_triglycerides} onChange={handleChange} unit="mg/dL" />
              </div>
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-50 rounded-md"><FileBarChart className="w-5 h-5 text-amber-600" /></div>
              <div>
                <h3 className="text-lg font-semibold">Organ Function</h3>
                <p className="text-sm text-slate-500">Liver, kidney, thyroid and vitamins</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-4">
                <InputField label="SGPT (ALT)" name="lft_sgpt" value={formData.lft_sgpt} onChange={handleChange} unit="U/L" />
                <InputField label="SGOT (AST)" name="lft_sgot" value={formData.lft_sgot} onChange={handleChange} unit="U/L" />
                <InputField label="Bilirubin" name="lft_bilirubin" value={formData.lft_bilirubin} onChange={handleChange} unit="mg/dL" />
              </div>

              <div className="space-y-4">
                <InputField label="Creatinine" name="kft_creatinine" value={formData.kft_creatinine} onChange={handleChange} unit="mg/dL" />
                <InputField label="Urea" name="kft_urea" value={formData.kft_urea} onChange={handleChange} unit="mg/dL" />
                <InputField label="eGFR" name="kft_egfr" value={formData.kft_egfr} onChange={handleChange} unit="mL/min" />
              </div>

              <div className="space-y-4">
                <InputField label="TSH" name="thyroid_tsh" value={formData.thyroid_tsh} onChange={handleChange} unit="mIU/L" />
                <InputField label="Vitamin D" name="vit_d" value={formData.vit_d} onChange={handleChange} unit="ng/mL" />
                <InputField label="Vitamin B12" name="vit_b12" value={formData.vit_b12} onChange={handleChange} unit="pg/mL" />
              </div>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-50 rounded-md"><Leaf className="w-5 h-5 text-green-600" /></div>
              <div>
                <h3 className="text-lg font-semibold">Environment & Habits</h3>
                <p className="text-sm text-slate-500">Air, water, UV and lifestyle</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <InputField label="AQI" name="env_aqi" value={formData.env_aqi} onChange={handleChange} />
              <InputField label="Water TDS" name="env_water_tds" value={formData.env_water_tds} onChange={handleChange} unit="ppm" />
              <InputField label="UV Index" name="env_uv_index" value={formData.env_uv_index} onChange={handleChange} />
              <InputField label="Daily Calories (intake)" name="calories_intake_avg" value={formData.calories_intake_avg} onChange={handleChange} />
              <InputField label="Daily Calories Burned" name="calories_burn_avg" value={formData.calories_burn_avg} onChange={handleChange} />
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-rose-50 rounded-md"><Dna className="w-5 h-5 text-rose-600" /></div>
              <div>
                <h3 className="text-lg font-semibold">Family & Medical History</h3>
                <p className="text-sm text-slate-500">Genetic predisposition and long-term conditions</p>
              </div>
            </div>

            <textarea
              name="family_history"
              value={formData.family_history}
              onChange={handleChange}
              rows={6}
              className="w-full rounded-md border border-slate-200 px-3 py-2"
              placeholder="e.g. Diabetes, Hypertension, Heart Disease in family..."
            />

            <div className="flex items-center gap-3 mt-4">
              <button
                onClick={generatePlan}
                disabled={isAnalyzing}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md shadow hover:bg-indigo-700 flex items-center gap-2"
              >
                {isAnalyzing ? <Loader2 className="animate-spin w-4 h-4" /> : "Generate Lifestyle Plan"}
              </button>

              <button
                onClick={() => { setStep(1); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                className="bg-white border border-slate-200 px-4 py-2 rounded-md text-slate-700"
              >
                Edit Data
              </button>
            </div>
          </motion.div>
        );

      case 5:
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="bg-white p-6 rounded-xl shadow border">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold">Your Lifestyle Plan</h2>
                  <p className="text-sm text-slate-500">AI generated — use as guidance only</p>
                </div>

                <div>
                  <button onClick={() => window.print()} className="text-slate-700 flex items-center gap-2">
                    <Save className="w-4 h-4" /> Save / Print
                  </button>
                </div>
              </div>

              <div className="prose max-w-full">
                <ReactMarkdown>{report || "No report available."}</ReactMarkdown>
              </div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="text-sm font-semibold text-slate-700">Step</div>
          <div className="px-3 py-1 bg-indigo-50 rounded-full text-indigo-700 font-medium">{step}/4</div>
        </div>

        <div className="flex items-center gap-3">
          {step > 1 && (
            <button onClick={() => setStep((s) => Math.max(1, s - 1))} className="text-slate-600 flex items-center gap-2">
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
          )}

          {step < 4 && (
            <button onClick={() => setStep((s) => Math.min(4, s + 1))} className="text-indigo-600 flex items-center gap-2">
              Next <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {stepContent()}
    </div>
  );
}
