"use client";

import React from "react";
import { Search, X } from "lucide-react";

export default function SearchField({
  value = "",
  onChange,
  onClear,
  placeholder = "Search...",
  className = "",
}) {
  return (
    <div
      className={`flex items-center w-full rounded-full border border-gray-300 px-4 py-2 bg-white focus-within:border-black transition ${className}`}
    >
      {/* Search Icon */}
      <Search size={18} className="text-gray-400 mr-2" />

      {/* Input */}
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-transparent outline-none text-sm"
      />

      {/* Clear Button */}
      {value && (
        <button
          type="button"
          onClick={onClear}
          className="ml-2"
        >
          <X
            size={16}
            className="text-gray-400 hover:text-black transition"
          />
        </button>
      )}
    </div>
  );
}