"use client";

import { X, Ticket, Sparkles } from "lucide-react";
import TicketTypeForm from "../form/TicketTypeForm";

export default function TicketTypeModal({
  open,
  onClose,
  onSubmit,
  defaultValues,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 sm:p-6">
      {/* 1. Smooth Backdrop Layer with heavy blur */}
      <div
        className="absolute inset-0 bg-slate-900/30 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      />

      {/* 2. Modal Card - Optimized Corners (3xl/ Squircle) */}
      <div className="relative bg-white rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.14)] w-full max-w-xl overflow-hidden animate-in fade-in zoom-in duration-300 border border-slate-100">
        
        {/* 3. Header Section - Cleaner & Integrated with Icon */}
        <div className="relative px-10 pt-10 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white-50 text-black shadow-inner border border-sky-100">
                {defaultValues?.id ? <Sparkles size={28} /> : <Ticket size={28} />}
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-800 tracking-tight">
                  {defaultValues?.id ? "Edit Ticket Type" : "Create Ticket Type"}
                </h2>
                <p className="text-slate-500 text-sm font-medium">
                  Set pricing, limits and details
                </p>
              </div>
            </div>

            {/* Elegant Close Button */}
            <button
              onClick={onClose}
              className="p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-xl transition-all border border-slate-100 group"
            >
              <X size={20} className="group-hover:rotate-90 transition-transform duration-200" />
            </button>
          </div>
        </div>

        {/* 4. Form Content - Nested Layout for Better Corners */}
        <div >
          {/* Inner Wrapper for consistent corner nesting */}
                <TicketTypeForm
                  onSubmit={onSubmit}
                  defaultValues={defaultValues}
                  onCancel={onClose} // Optional: Agar cancel button form mein chahiye
                />
        </div>
      </div>
    </div>
  );
}