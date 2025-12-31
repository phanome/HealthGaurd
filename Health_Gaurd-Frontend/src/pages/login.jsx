import React, { useState } from "react";
import api from "../api/api";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault(); // 🔥 VERY IMPORTANT

    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      // Save token
      localStorage.setItem("token", res.data.token);

      // Redirect
      navigate("/profile");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="max-w-md mx-auto mt-20 p-6 bg-white shadow rounded">
    <h2 className="text-2xl font-semibold mb-4 text-center">Login</h2>

    <form onSubmit={handleLogin} className="space-y-4">
      <input
        type="email"
        placeholder="Email"
        className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        autoComplete="email"
        required
      />

      <input
        type="password"
        placeholder="Password"
        className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        autoComplete="current-password"
        required
      />

      {error && (
        <p className="text-red-600 text-sm text-center">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
      >
        {loading ? "Logging in..." : "Login"}
      </button>

      {/* SIGN UP LINK */}
      <p className="text-sm text-center mt-4">
        Don’t have an account?{" "}
        <Link
          to="/signup"
          className="text-indigo-600 hover:underline font-medium"
        >
          Sign up
        </Link>
      </p>
    </form>
  </div>
);
}