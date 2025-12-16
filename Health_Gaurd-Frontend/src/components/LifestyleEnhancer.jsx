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

/* ----------------------------------
   Reusable Input
---------------------------------- */
const InputField = ({ label, name, value, onChange, unit }) => (
  <div className="space-y-1">
    <label className="text-xs font-medium text-slate-600">{label}</label>
    <div className="relative">
      <input
        name={name}
        value={value}
        onChange={onChange}
        className="w-full rounded-md border px-3 py-2 focus:ring-2 focus:ring-indigo-400"
      />
      {unit && (
        <span className="absolute right-3 top-2 text-xs text-slate-400">
          {unit}
        </span>
      )}
    </div>
  </div>
);

/* ----------------------------------
   Main Component
---------------------------------- */
export default function LifestyleEnhancer() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState("");

  /* -------- SINGLE SOURCE OF TRUTH -------- */
  const [formData, setFormData] = useState({
    // CBC
    blood_hemoglobin: "",
    blood_wbc: "",
    blood_platelets: "",

    // Sugar profile
    blood_fbs: "",
    blood_ppbs: "",
    blood_rbs: "",
    blood_hba1c: "",

    // Lipid profile
    lipid_cholesterol: "",
    lipid_hdl: "",
    lipid_ldl: "",
    lipid_triglycerides: "",

    // Environment & calories
    env_aqi: "",
    env_water_tds: "",
    env_uv_index: "",
    calories_intake_avg: "",
    calories_burn_avg: "",

    // Family
    family_history: "",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const generatePlan = async () => {
    setLoading(true);
    try {
      const res = await api.post("/ai/lifestyle-enhancer", {
        inputData: formData,
      });
      setReport(res.data?.report || "");
      setStep(6);
    } catch (err) {
      console.error(err);
      alert("Failed to generate lifestyle plan.");
    } finally {
      setLoading(false);
    }
  };

  /* ----------------------------------
     Step Content
  ---------------------------------- */
  const stepContent = () => {
    switch (step) {
      /* -------- STEP 1 : CBC -------- */
      case 1:
        return (
          <StepCard title="Blood Profile (CBC)" icon={<Activity />}>
            <ReportUpload />
            <Grid>
              <InputField label="Hemoglobin" name="blood_hemoglobin" value={formData.blood_hemoglobin} onChange={handleChange} unit="g/dL" />
              <InputField label="WBC Count" name="blood_wbc" value={formData.blood_wbc} onChange={handleChange} unit="/µL" />
              <InputField label="Platelets" name="blood_platelets" value={formData.blood_platelets} onChange={handleChange} unit="10³/µL" />
            </Grid>
          </StepCard>
        );

      /* -------- STEP 2 : SUGAR -------- */
      case 2:
        return (
          <StepCard title="Sugar Profile" icon={<Activity />}>
            <Grid>
              <InputField label="Fasting Blood Sugar" name="blood_fbs" value={formData.blood_fbs} onChange={handleChange} unit="mg/dL" />
              <InputField label="Post-Prandial Sugar" name="blood_ppbs" value={formData.blood_ppbs} onChange={handleChange} unit="mg/dL" />
              <InputField label="Random Blood Sugar" name="blood_rbs" value={formData.blood_rbs} onChange={handleChange} unit="mg/dL" />
              <InputField label="HbA1c" name="blood_hba1c" value={formData.blood_hba1c} onChange={handleChange} unit="%" />
            </Grid>
          </StepCard>
        );

      /* -------- STEP 3 : LIPID -------- */
      case 3:
        return (
          <StepCard title="Lipid Profile" icon={<Activity />}>
            <Grid>
              <InputField label="Total Cholesterol" name="lipid_cholesterol" value={formData.lipid_cholesterol} onChange={handleChange} unit="mg/dL" />
              <InputField label="HDL" name="lipid_hdl" value={formData.lipid_hdl} onChange={handleChange} unit="mg/dL" />
              <InputField label="LDL" name="lipid_ldl" value={formData.lipid_ldl} onChange={handleChange} unit="mg/dL" />
              <InputField label="Triglycerides" name="lipid_triglycerides" value={formData.lipid_triglycerides} onChange={handleChange} unit="mg/dL" />
            </Grid>
          </StepCard>
        );

      /* -------- STEP 4 : ENV -------- */
      case 4:
        return (
          <StepCard title="Environment & Calories" icon={<Leaf />}>
            <Grid>
              <InputField label="Air Quality Index" name="env_aqi" value={formData.env_aqi} onChange={handleChange} />
              <InputField label="Water TDS" name="env_water_tds" value={formData.env_water_tds} onChange={handleChange} />
              <InputField label="UV Index" name="env_uv_index" value={formData.env_uv_index} onChange={handleChange} />
              <InputField label="Calories Intake / Day" name="calories_intake_avg" value={formData.calories_intake_avg} onChange={handleChange} />
              <InputField label="Calories Burn / Day" name="calories_burn_avg" value={formData.calories_burn_avg} onChange={handleChange} />
            </Grid>
          </StepCard>
        );

      /* -------- STEP 5 : FAMILY -------- */
      case 5:
        return (
          <StepCard title="Family History & Review" icon={<Dna />}>
            <textarea
              name="family_history"
              value={formData.family_history}
              onChange={handleChange}
              rows={4}
              placeholder="Family history of diabetes, heart disease, thyroid, cancer..."
              className="w-full border rounded-md p-3"
            />

            <button
              onClick={generatePlan}
              disabled={loading}
              className="mt-6 bg-indigo-600 text-white px-6 py-2 rounded-md flex items-center gap-2"
            >
              {loading && <Loader2 className="animate-spin w-4 h-4" />}
              Generate Lifestyle Plan
            </button>
          </StepCard>
        );

      /* -------- STEP 6 : RESULT -------- */
      case 6:
        return (
          <StepCard title="Your Personalized Lifestyle Plan" icon={<FileBarChart />}>
            <div className="prose max-w-full">
              <ReactMarkdown>{report || "No report generated."}</ReactMarkdown>
            </div>
            <button onClick={() => window.print()} className="mt-4 flex gap-2 text-slate-600">
              <Save className="w-4 h-4" /> Save / Print
            </button>
          </StepCard>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <Header step={step} setStep={setStep} />
      {stepContent()}
    </div>
  );
}

/* ----------------------------------
   UI Helpers
---------------------------------- */
const StepCard = ({ title, icon, children }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white p-6 rounded-xl shadow border space-y-6"
  >
    <div className="flex items-center gap-3">
      <div className="p-2 bg-indigo-50 rounded-md text-indigo-600">{icon}</div>
      <h2 className="text-lg font-semibold">{title}</h2>
    </div>
    {children}
  </motion.div>
);

const Grid = ({ children }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">{children}</div>
);

const Header = ({ step, setStep }) => (
  <div className="flex justify-between mb-6">
    <div className="text-sm font-semibold text-slate-700">
      Step {step} / 6
    </div>
    <div className="flex gap-3">
      {step > 1 && step < 6 && (
        <button onClick={() => setStep(step - 1)} className="flex items-center gap-1 text-slate-600">
          <ChevronLeft className="w-4 h-4" /> Back
        </button>
      )}
      {step < 5 && (
        <button onClick={() => setStep(step + 1)} className="flex items-center gap-1 text-indigo-600">
          Next <ChevronRight className="w-4 h-4" />
        </button>
      )}
    </div>
  </div>
);
