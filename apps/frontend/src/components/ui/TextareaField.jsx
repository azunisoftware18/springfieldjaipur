"use client";

import React from "react";

const TextareaField = React.forwardRef(({
  label,
  placeholder = "",
  error = "",
  className = "",
  disabled = false,
  rows = 4,
  resize = "", // 👈 new prop
  ...rest
}, ref) => {

  const resizeClass = {
    none: "resize-none",
    vertical: "resize-y",
    horizontal: "resize-x",
    both: "resize",
  };

  return (
    <div className={`w-full ${className}`}>
      
      {label && (
        <label className="mb-1 block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <div
        className={`rounded-lg border px-3 py-2 transition
        ${error ? "border-red-500" : "border-gray-300"}
        focus-within:border-black`}
      >
        <textarea
          ref={ref}
          rows={rows}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full bg-transparent outline-none text-sm ${resizeClass[resize]}`}
          {...rest}
        />
      </div>

      {error && (
        <p className="mt-1 text-xs text-red-500">{error}</p>
      )}
    </div>
  );
});

TextareaField.displayName = "TextareaField";

export default TextareaField;