import React, { useState, useRef, useEffect, useContext } from "react";
import { LogOut, User, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function AvatarMenu() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef();
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout(); // clears token + user
    setOpen(false);
    navigate("/login", { replace: true });
  };

  return (
    <div className="relative" ref={menuRef}>
      {/* AVATAR BUTTON */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="
          w-10 h-10 
          rounded-lg
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
            z-50
          "
        >
          <div className="py-2">
            <MenuItem
              icon={<User size={18} />}
              label="Profile"
              onClick={() => {
                setOpen(false);
                navigate("/profile");
              }}
            />

            <MenuItem
              icon={<Settings size={18} />}
              label="Settings"
              onClick={() => {
                setOpen(false);
                navigate("/settings");
              }}
            />

            <MenuItem
              icon={<LogOut size={18} />}
              label="Logout"
              isDanger
              onClick={handleLogout}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// Small dropdown item component
function MenuItem({ icon, label, isDanger, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        flex items-center gap-3 w-full
        px-4 py-2.5 text-sm
        text-left transition-all
        hover:bg-slate-100
        ${isDanger ? "text-red-600 hover:bg-red-50" : "text-slate-700"}
      `}
    >
      {icon}
      {label}
    </button>
  );
}
