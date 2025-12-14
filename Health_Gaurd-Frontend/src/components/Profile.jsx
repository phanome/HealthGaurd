import React, { useEffect, useState, useContext } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { Activity, FileBarChart, Clock, ChevronDown } from "lucide-react";

export default function Profile() {
  const { user } = useContext(AuthContext);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openIndex, setOpenIndex] = useState(null);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const res = await api.get("/api/records/me");
        setRecords(res.data.records);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };

    fetchRecords();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto">

      {/* User Info Card */}
      <div className="bg-white p-6 rounded-xl shadow mb-8 border border-slate-200">
        <h2 className="text-2xl font-bold mb-1 text-slate-900">My Profile</h2>
        <p className="text-slate-600">
          {user.first_name} {user.last_name}
        </p>
        <p className="text-slate-600">{user.email}</p>
      </div>

      {/* Records Section */}
      <h3 className="text-xl font-bold mb-4 text-slate-800">My Records</h3>

      {records.length === 0 && (
        <p className="text-slate-500">No records yet. Try using SymptomChecker or LifestyleEnhancer.</p>
      )}

      <div className="space-y-4">
        {records.map((record, index) => (
          <div
            key={record._id}
            className="bg-white border border-slate-200 rounded-xl shadow p-5 cursor-pointer"
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">

                {record.type === "symptom" ? (
                  <Activity className="w-6 h-6 text-indigo-600" />
                ) : (
                  <FileBarChart className="w-6 h-6 text-green-600" />
                )}

                <div>
                  <h4 className="text-lg font-semibold capitalize">
                    {record.type} record
                  </h4>
                  <p className="text-sm text-slate-500 flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {new Date(record.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              <ChevronDown
                className={`w-5 h-5 text-slate-500 transition-transform ${
                  openIndex === index ? "rotate-180" : ""
                }`}
              />
            </div>

            {/* Expandable Section */}
            {openIndex === index && (
              <div className="mt-4 border-t pt-4">

                <h5 className="font-semibold text-slate-700 mb-2">Input Data</h5>
                <pre className="text-xs bg-slate-100 p-3 rounded-lg overflow-x-auto">
                  {JSON.stringify(record.inputData, null, 2)}
                </pre>

                <h5 className="font-semibold text-slate-700 mt-4 mb-2">AI Result</h5>
                <div className="bg-indigo-50 p-4 rounded-lg text-sm text-slate-800 leading-relaxed">
                  {record.aiResult || "No AI output stored"}
                </div>

              </div>
            )}
          </div>
        ))}
      </div>

    </div>
  );
}
