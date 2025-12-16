import React, { useState } from "react";
import api from "../api/api";
import SymptomResult from "./SymptomResult";

export default function SymptomChecker() {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([]);
  const [structured, setStructured] = useState(null);
  const [loading, setLoading] = useState(false);
  const [locLoading, setLocLoading] = useState(false);
  const [location, setLocation] = useState(null);
  const [error, setError] = useState("");

  // ---------------------------------------
  // 📍 DETECT USER LOCATION
  // ---------------------------------------
  const getLocation = () => {
    setLocLoading(true);
    setError("");

    if (!navigator.geolocation) {
      setError("Geolocation not supported by this browser.");
      setLocLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
            {
              headers: {
                "User-Agent": "HealthGuardAI/1.0",
              },
            }
          );

          const data = await res.json();

          setLocation({
            city:
              data.address?.city ||
              data.address?.town ||
              data.address?.village ||
              "",
            state: data.address?.state || "",
            country: data.address?.country || "",
          });
        } catch (err) {
          console.error("Location error:", err);
          setError("Failed to detect location.");
        } finally {
          setLocLoading(false);
        }
      },
      () => {
        setError("Location permission denied.");
        setLocLoading(false);
      }
    );
  };

  // ---------------------------------------
  // 🚀 SEND MESSAGE TO API
  // ---------------------------------------
  const sendMessage = async () => {
  if (!input.trim()) return;

  setError("");
  setStructured(null);

  let msg = input.trim();
  if (location) {
    msg += `\n\nUser Location: ${location.city}, ${location.state}, ${location.country}`;
  }

  const newHistory = [...history, { role: "user", content: msg }];
  setHistory(newHistory);

  try {
    setLoading(true);

    const res = await api.post("/ai/symptom-checker", {
      message: msg,
      history: newHistory,
    });

    const payload = res.data?.response || res.data;

    if (payload?.error) {
      setError(payload.error);
      return;
    }

    if (!payload || !Array.isArray(payload.conditions)) {
      console.warn("Bad AI response:", JSON.stringify(res.data, null, 2));
      setError("⚠️ AI response was unclear. Try again.");
      return;
    }

    setStructured(payload);
    setInput("");
  } catch (err) {
    console.error(err);
    setError("❌ Failed to analyze symptoms.");
  } finally {
    setLoading(false);
  }
};



  // ---------------------------------------
  // 🎨 UI
  // ---------------------------------------
  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-semibold mb-6">Symptom Checker</h1>

      <button
        onClick={getLocation}
        disabled={locLoading}
        className="mb-3 bg-green-600 text-white px-4 py-2 rounded disabled:opacity-60"
      >
        {locLoading ? "Detecting..." : "📍 Use My Location"}
      </button>

      {location && (
        <p className="text-sm text-slate-700 mb-4">
          📌 {location.city}, {location.state}, {location.country}
        </p>
      )}

      <textarea
        className="w-full border p-3 rounded"
        rows={3}
        placeholder="Describe your symptoms..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <div className="flex gap-3 mt-4">
        <button
          onClick={sendMessage}
          disabled={loading}
          className="bg-indigo-600 text-white px-4 py-2 rounded disabled:opacity-60"
        >
          {loading ? "Analyzing..." : "Check Symptoms"}
        </button>

        <button
          onClick={() => {
            setInput("");
            setStructured(null);
            setError("");
          }}
          className="text-sm text-slate-600"
        >
          Clear
        </button>
      </div>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

      {structured && (
        <div className="mt-6">
          <SymptomResult data={structured} />
        </div>
      )}
    </div>
  );
}
