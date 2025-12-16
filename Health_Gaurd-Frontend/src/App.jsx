import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Layout from "./components/Layout.jsx";
import Home from "./components/Home.jsx";
import SymptomChecker from "./components/SymptomChecker.jsx";
import LifestyleEnhancer from "./components/LifestyleEnhancer.jsx";
import LifestyleResult from "./components/LifestyleResult.jsx";
import Profile from "./components/Profile.jsx";

import Signup from "./pages/Signup.jsx";
import Login from "./pages/Login.jsx";

import ProtectedRoute from "./components/ProtectedRoute.jsx";
import GuestRoute from "./components/GuestRoute.jsx";

export default function App() {
  return (
    <Layout>
      <Routes>
        {/* ================= PUBLIC ROUTES ================= */}
        <Route path="/" element={<Home />} />

        {/* ================= PROTECTED FEATURE ROUTES ================= */}
        <Route
          path="/symptom-checker"
          element={
            <ProtectedRoute>
              <SymptomChecker />
            </ProtectedRoute>
          }
        />

        <Route
          path="/lifestyle-enhancer"
          element={
            <ProtectedRoute>
              <LifestyleEnhancer />
            </ProtectedRoute>
          }
        />

        <Route
          path="/lifestyle-result"
          element={
            <ProtectedRoute>
              <LifestyleResult />
            </ProtectedRoute>
          }
        />

        {/* ================= REDIRECT WRONG / OLD ROUTES ================= */}
        <Route
          path="/SymptomChecker"
          element={<Navigate to="/symptom-checker" replace />}
        />
        <Route
          path="/LifestyleEnhancer"
          element={<Navigate to="/lifestyle-enhancer" replace />}
        />

        {/* ================= GUEST ONLY ROUTES ================= */}
        <Route
          path="/signup"
          element={
            <GuestRoute>
              <Signup />
            </GuestRoute>
          }
        />

        <Route
          path="/login"
          element={
            <GuestRoute>
              <Login />
            </GuestRoute>
          }
        />

        {/* ================= PROTECTED ROUTES ================= */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* ================= FALLBACK ROUTE ================= */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}
