import React from 'react';

const InputField = React.forwardRef(({
  label,
  type = "text",
  placeholder = "",
  error = "",
  icon: Icon,
  className = "",
  disabled = false,
  ...rest
}, ref) => {
  return (
    <div className={`w-full ${className}`}>
      
      {label && (
        <label className="mb-1 block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <div className={`flex items-center rounded-lg border px-3 py-2
        ${error ? "border-red-500" : "border-gray-300"}
        focus-within:border-black
      `}>
        
        {Icon && <Icon size={18} className="mr-2 text-gray-400" />}

        <input
          ref={ref}
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full bg-transparent outline-none text-sm"
          {...rest}
        />
      </div>

      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
});

InputField.displayName = "InputField";
export default InputField;