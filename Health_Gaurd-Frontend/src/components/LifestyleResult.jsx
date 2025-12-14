import React from "react";
import { motion } from "framer-motion";
import { FileBarChart, Salad, Dumbbell, Leaf, ShieldAlert, Info } from "lucide-react";
import ReactMarkdown from "react-markdown";

const card = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function LifestyleResult({ data }) {
  const sections = [
    {
      title: "Health Summary",
      icon: FileBarChart,
      color: "text-blue-600",
      bg: "bg-blue-50",
      text: data.summary
    },
    {
      title: "Diet Recommendations",
      icon: Salad,
      color: "text-green-600",
      bg: "bg-green-50",
      text: data.diet
    },
    {
      title: "Fitness Plan",
      icon: Dumbbell,
      color: "text-purple-600",
      bg: "bg-purple-50",
      text: data.fitness
    },
    {
      title: "Environmental Adjustments",
      icon: Leaf,
      color: "text-amber-600",
      bg: "bg-amber-50",
      text: data.environment
    },
    {
      title: "Risk Precautions",
      icon: ShieldAlert,
      color: "text-red-600",
      bg: "bg-red-50",
      text: data.risk
    },
    {
      title: "Medical Disclaimer",
      icon: Info,
      color: "text-slate-600",
      bg: "bg-slate-100",
      text: data.disclaimer
    }
  ];

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      transition={{ staggerChildren: 0.15 }}
      className="space-y-6"
    >
      {sections.map((sec, i) => (
        <motion.div
          key={i}
          variants={card}
          className={`p-6 rounded-xl shadow border ${sec.bg}`}
        >
          <div className="flex items-center gap-3 mb-3">
            <sec.icon className={`w-6 h-6 ${sec.color}`} />
            <h2 className="text-xl font-semibold">{sec.title}</h2>
          </div>

          <ReactMarkdown className="prose prose-slate">
            {sec.text || "No data available."}
          </ReactMarkdown>
        </motion.div>
      ))}
    </motion.div>
  );
}
