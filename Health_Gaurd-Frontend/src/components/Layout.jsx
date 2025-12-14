import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Activity,
  MessageSquare,
  Home,
  User,
  HeartPulse,
} from "lucide-react";
import { cn } from "../libb/utils.js";
import AvatarMenu from "./AvatarMenu";

export default function Layout({ children }) {
  const location = useLocation();

  const navItems = [
    { name: "Home", path: "/", icon: Home },
    { name: "Symptom Checker", path: "/symptom-checker", icon: MessageSquare },
    {
      name: "Lifestyle Enhancer",
      path: "/lifestyle-enhancer",
      icon: Activity,
    },
    { name: "My Profile", path: "/profile", icon: User },
  ];
  

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">

      {/* ---------------- LEFT SIDEBAR ---------------- */}
      <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
        <div className="flex flex-col flex-grow border-r border-slate-200 bg-white pt-5 pb-4 overflow-y-auto">

          {/* Logo */}
          <div className="flex items-center px-6 mb-8">
            <HeartPulse className="h-8 w-8 text-teal-600 mr-2" />
            <span className="text-xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
              HealthGuard
            </span>
          </div>

          {/* Sidebar Navigation */}
          <nav className="px-3 space-y-1">
            {navItems.map((item) => {
              const isActive =
                location.pathname === item.path ||
                location.pathname.startsWith(item.path + "/");

              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={cn(
                    "group flex items-center px-3 py-2.5 rounded-lg font-medium transition-colors",
                    isActive
                      ? "bg-teal-50 text-teal-700"
                      : "text-slate-600 hover:bg-slate-50"
                  )}
                >
                  <item.icon
                    className={cn(
                      "mr-3 h-5 w-5",
                      isActive ? "text-teal-600" : "text-slate-400"
                    )}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* ---------------- MAIN CONTENT AREA ---------------- */}
      <div className="md:ml-64 min-h-screen relative">

        {/* Avatar Menu */}
        <div className="absolute top-4 right-6 z-50">
          <AvatarMenu />
        </div>

        {/* Render Page Content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
