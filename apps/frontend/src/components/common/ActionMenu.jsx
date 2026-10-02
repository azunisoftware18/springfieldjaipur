"use client";

import { useEffect, useRef, useState } from "react";
import { MoreVertical } from "lucide-react";

export default function ActionMenu({
  items = [], // [{ label, onClick, icon: Icon, danger }]
  className = "",
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // close on ESC
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div ref={ref} className={`relative inline-block text-left ${className}`}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="p-2 rounded-full hover:bg-slate-100 transition"
      >
        <MoreVertical size={18} className="text-gray-600" />
      </button>

      {/* Menu */}
      {open && (
        <div className="absolute right-0 mt-2 w-40 rounded-xl bg-white border border-gray-200 shadow-lg z-50">
          <ul className="py-1 text-sm">
            {items.map((item, idx) => {
              const Icon = item.icon;
              return (
                <li key={idx}>
                  <button
                    type="button"
                    onClick={() => {
                      item.onClick?.();
                      setOpen(false);
                    }}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-slate-50 transition
                      ${item.danger ? "text-red-600 hover:bg-red-50" : "text-gray-700"}`}
                  >
                    {Icon && <Icon size={16} />}
                    {item.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}