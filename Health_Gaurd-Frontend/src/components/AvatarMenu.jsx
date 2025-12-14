import React, { useState, useRef, useEffect } from "react";
import { LogOut, User, Settings } from "lucide-react";

export default function AvatarMenu() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef();

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      {/* AVATAR BUTTON */}
      <button
        onClick={() => setOpen(!open)}
        className="
          w-10 h-10 
          rounded-lg                       /* ← Square avatar */
          bg-slate-200                     
          flex items-center justify-center 
          border border-slate-300/60 
          hover:bg-slate-300/80 
          transition-all duration-200 
          shadow-sm hover:shadow 
        "
      >
        <span className="text-slate-700 font-semibold text-sm">AB</span>
      </button>

      {/* DROPDOWN MENU */}
      {open && (
        <div
          className="
            absolute right-0 mt-2
            w-48 rounded-xl
            bg-white shadow-lg border border-slate-200 
            animate-fadeIn 
            z-50
          "
        >
          <div className="py-2">
            <MenuItem icon={<User size={18} />} label="Profile" />
            <MenuItem icon={<Settings size={18} />} label="Settings" />
            <MenuItem icon={<LogOut size={18} />} label="Logout" isDanger />
          </div>
        </div>
      )}
    </div>
  );
}

// Small dropdown item component
function MenuItem({ icon, label, isDanger }) {
  return (
    <button
      className={`
        flex items-center gap-3 w-full 
        px-4 py-2.5 text-sm 
        text-left transition-all 
        hover:bg-slate-100 
        ${isDanger ? "text-red-600 hover:bg-red-50" : "text-slate-700"}
      `}
    >
      {icon} {label}
    </button>
  );
}
