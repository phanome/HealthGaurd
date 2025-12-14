import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../api/axios";
import { useNavigate, Link } from "react-router-dom";
import { UserPlus } from "lucide-react";

export default function Signup() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      // 1️⃣ Call Node.js signup API
      const res = await api.post("/auth/signup", form);

      if (!res.data.token) {
        throw new Error("Token missing from response");
      }

      const token = res.data.token;

      // 2️⃣ Save user auth in context
      login(res.data.user, token);

      // 3️⃣ Set Authorization header for future API calls
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // 4️⃣ Navigate to homepage
      navigate("/");

    } catch (err) {
      console.error("Signup Error:", err);
      alert(
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Signup failed"
      );
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 bg-white p-8 shadow-lg rounded-xl border border-slate-200">

      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-green-100 rounded-full">
          <UserPlus className="w-6 h-6 text-green-700" />
        </div>
        <h1 className="text-2xl font-bold text-slate-800">Create an Account</h1>
      </div>

      <form onSubmit={handleSignup} className="space-y-4">

        <input
          type="text"
          name="first_name"
          placeholder="First Name"
          className="input"
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="last_name"
          placeholder="Last Name"
          className="input"
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          className="input"
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="input"
          onChange={handleChange}
          required
        />

        <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-xl font-semibold shadow">
          Create Account
        </button>

      </form>

      <p className="text-sm text-slate-500 mt-4 text-center">
        Already have an account?{" "}
        <Link to="/login" className="text-green-600 font-medium">
          Login here
        </Link>
      </p>

    </div>
  );
}
