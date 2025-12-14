import React from "react";
import {
  AlertTriangle,
  Activity,
  FlaskConical,
  HeartPulse,
  ShieldAlert,
} from "lucide-react";
import {motion} from "framer-motion";

// Animation Variants
const fadeIn = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

export default function SymptomResult({ data }) {
  const conditions = data?.conditions || [];
  const tests = data?.tests || [];
  const remedies = data?.remedies || [];
  const doctor = data?.doctor || {};
  const disclaimer = data?.disclaimer || {};

  const percent = (p) => parseInt(p?.replace("%", "") || 0);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={stagger}
      className="space-y-8"
    >
      {/* ======================
          CONDITIONS
      ======================= */}
      <motion.section variants={fadeIn} className="bg-white p-6 rounded-xl shadow border">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="text-indigo-600" />
          <h2 className="text-xl font-semibold">Possible Conditions</h2>
        </div>

        {conditions.length === 0 ? (
          <p className="text-slate-500">No conditions predicted.</p>
        ) : (
          <div className="space-y-4">
            {conditions.map((c, idx) => (
              <motion.div
                key={idx}
                variants={fadeIn}
                className="p-3 bg-slate-50 rounded-lg"
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium text-slate-800">{c.name}</span>
                  <span className="text-slate-600">{c.probability}</span>
                </div>

                {/* Animated Probability Bar */}
                <div className="w-full bg-slate-200 h-2 rounded overflow-hidden">
                  <motion.div
                    className="h-2 bg-indigo-600"
                    initial={{ width: 0 }}
                    animate={{ width: `${percent(c.probability)}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.section>

      {/* ======================
          TESTS
      ======================= */}
      <motion.section variants={fadeIn} className="bg-white p-6 rounded-xl shadow border">
        <div className="flex items-center gap-2 mb-4">
          <FlaskConical className="text-green-600" />
          <h2 className="text-xl font-semibold">Recommended Tests</h2>
        </div>

        {tests.length === 0 ? (
          <p className="text-slate-500">No tests recommended.</p>
        ) : (
          <motion.ul variants={stagger} className="list-disc ml-5 space-y-2">
            {tests.map((t, idx) => (
              <motion.li key={idx} variants={fadeIn} className="text-slate-700">
                <span className="font-medium text-slate-800">{t.name}:</span>{" "}
                {t.description}
              </motion.li>
            ))}
          </motion.ul>
        )}
      </motion.section>

      {/* ======================
          REMEDIES
      ======================= */}
      <motion.section variants={fadeIn} className="bg-white p-6 rounded-xl shadow border">
        <div className="flex items-center gap-2 mb-4">
          <HeartPulse className="text-rose-600" />
          <h2 className="text-xl font-semibold">Home Remedies</h2>
        </div>

        {remedies.length === 0 ? (
          <p className="text-slate-500">No remedies available.</p>
        ) : (
          <motion.ul variants={stagger} className="list-disc ml-5 space-y-2">
            {remedies.map((r, idx) => (
              <motion.li key={idx} variants={fadeIn} className="text-slate-700">
                <span className="font-medium text-slate-800">{r.name}:</span>{" "}
                {r.description}
              </motion.li>
            ))}
          </motion.ul>
        )}
      </motion.section>

      {/* ======================
          DOCTOR GUIDANCE
      ======================= */}
      <motion.section variants={fadeIn} className="bg-white p-6 rounded-xl shadow border">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="text-orange-500" />
          <h2 className="text-xl font-semibold">When to See a Doctor</h2>
        </div>

        <p className="text-slate-700">{doctor?.when_to_visit}</p>
      </motion.section>

      {/* ======================
          DISCLAIMER
      ======================= */}
      <motion.section
        variants={fadeIn}
        className="bg-yellow-50 p-6 rounded-xl shadow border border-yellow-200"
      >
        <div className="flex items-center gap-2 mb-4">
          <ShieldAlert className="text-yellow-700" />
          <h2 className="text-xl font-semibold">Disclaimer</h2>
        </div>

        <p className="text-slate-700 leading-relaxed">{disclaimer?.text}</p>
      </motion.section>
    </motion.div>
  );
}
