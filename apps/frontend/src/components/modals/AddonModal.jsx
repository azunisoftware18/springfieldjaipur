"use client";

import { X, Package, Sparkles } from "lucide-react";
import AddonForm from "../form/AddonForm";

export default function AddonModal({ open, onClose, onSubmit, defaultValues }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 sm:p-6">
      {/* 1. Ultra-Smooth Backdrop Layer */}
      <div
        className="absolute inset-0 bg-slate-900/30 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      />

      {/* 2. Modal Card - Optimized Corners (Squircle/3xl) */}
      <div className="relative bg-white rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.14)] w-full max-w-xl overflow-hidden animate-in fade-in zoom-in duration-300 border border-slate-100">
        {/* 3. Header Section - Cleaner & Integrated */}
        <div className="relative px-10 pt-10 pb-4 ">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-50 text-gray-600 shadow-inner border border-sky-100">
                {defaultValues?.id ? (
                  <Sparkles size={28} />
                ) : (
                  <Package size={28} />
                )}
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-800 tracking-tight">
                  {defaultValues?.id ? "Edit Add-on" : "Create Add-on"}
                </h2>
                <p className="text-slate-500 text-sm font-medium">
                  Configure services, pricing & visibility
                </p>
              </div>
            </div>

            {/* Elegant Close Button */}
            <button
              onClick={onClose}
              className="p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-xl transition-all border border-slate-100 group"
            >
              <X
                size={20}
                className="group-hover:rotate-90 transition-transform duration-200"
              />
            </button>
          </div>
        </div>

        {/* 4. Form Content Area */}
        <div className="px-6  pt-4">
          <AddonForm
            onSubmit={onSubmit}
            defaultValues={defaultValues}
            onCancel={onClose} // Optional cancel handler passing
          />
        </div>
      </div>
    </div>
  );
}
