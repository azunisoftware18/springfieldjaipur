'use client';

import React from 'react';

export default function Button({ 
  text = "Button", 
  icon: Icon = null, 
  onClick, 
  type = "button",
  className = "",
  iconPosition = "right"
}) {
  return (
    <button 
      type={type}
      onClick={onClick}
      className={`group/work relative overflow-hidden rounded-xl   border border-black bg-[white] px-6 py-2.5 text-sm transition-all duration-300 hover:bg-black hover:shadow-lg active:scale-95 ${className}`}
    >
      {/* Hover Background */}
      <span className="absolute bottom-0 left-0 h-48 w-full origin-bottom translate-y-full transform rounded-full bg-black transition duration-300 ease-out group-hover/work:translate-y-14"></span>
      
      <div className="relative flex items-center justify-center gap-2">
        
        {/* Left Icon */}
        {Icon && iconPosition === "left" && (
          <Icon 
            size={18} 
            className="text-black transition-all duration-300 group-hover/work:text-white group-hover/work:-translate-x-1"
          />
        )}

        <span className="font-semibold text-black transition-colors duration-300 group-hover/work:text-white">
          {text}
        </span>

        {/* Right Icon */}
        {Icon && iconPosition === "right" && (
          <Icon 
            size={18} 
            className="text-black transition-all duration-300 group-hover/work:text-white group-hover/work:translate-x-1"
          />
        )}
      </div>
    </button>
  );
}