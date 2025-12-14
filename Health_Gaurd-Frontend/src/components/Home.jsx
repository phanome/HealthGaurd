import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Activity, ArrowRight, ShieldCheck, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <div className="space-y-12 pb-20">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-teal-600 to-emerald-800 text-white p-8 md:p-16 shadow-xl">
        <div className="relative z-10 max-w-2xl space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-5xl font-bold leading-tight">Advanced Health Intelligence</h1>
            <p className="mt-4 text-lg text-teal-100">
              Your personal AI health companion. Predict potential conditions and optimize your lifestyle with precision data.
            </p>
            <div className="mt-8 flex gap-4">
              <Link to="/syc">
                <button className="bg-white text-teal-700 px-6 py-3 rounded-full font-semibold shadow-lg hover:bg-teal-50">
                  Check Symptoms <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              </Link>
              <Link to="/">
                <button className="bg-teal-700/50 border border-teal-400/30 text-white px-6 py-3 rounded-full backdrop-blur-sm hover:bg-teal-700/70">
                  Analyze Lifestyle
                </button>
              </Link>
            </div>
          </motion.div>
        </div>

        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20" />
      </section>

      {/* Features */}
      <section className="grid md:grid-cols-2 gap-8">
        <motion.div whileHover={{ y: -5 }} className="group bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <MessageSquare className="w-12 h-12 text-teal-600 mb-4" />
          <h2 className="text-2xl font-bold">AI Symptom Checker</h2>
          <p className="text-slate-600 mt-3">
            Chat with our intelligent bot about your symptoms and get instant analysis.
          </p>
          <Link to="/syc" className="text-teal-600 font-semibold mt-4 inline-flex items-center">
            Start Assessment <ArrowRight className="ml-2" />
          </Link>
        </motion.div>

        <motion.div whileHover={{ y: -5 }} className="group bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <Activity className="w-12 h-12 text-indigo-600 mb-4" />
          <h2 className="text-2xl font-bold">Lifestyle Enhancer</h2>
          <p className="text-slate-600 mt-3">
            Upload health data and receive a personalized wellness plan.
          </p>
          <Link to="/LifestyleEnhancer" className="text-indigo-600 font-semibold mt-4 inline-flex items-center">
            View Dashboard <ArrowRight className="ml-2" />
          </Link>
        </motion.div>
      </section>

      {/* Trust */}
      <section className="bg-white rounded-2xl p-8 border border-slate-100">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <ShieldCheck className="w-6 h-6 text-blue-600" />
            <div>
              <h3 className="font-semibold">Secure Health Data</h3>
              <p className="text-sm text-slate-500">Your information is safe & encrypted.</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Heart className="w-6 h-6 text-rose-600" />
            <div>
              <h3 className="font-semibold">Holistic Care</h3>
              <p className="text-sm text-slate-500">Genetics, lifestyle & environment included.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
