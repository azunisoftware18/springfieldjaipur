"use client";

import { X, CalendarClock, Settings2 } from "lucide-react";
import SlotOverrideForm from "../form/SlotOverrideForm"; // Path verify karlein

export default function SlotOverrideModal({
  open,
  onClose,
  onSubmit,
  defaultValues,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-4">
      {/* 1. Backdrop with high blur */}
      <div
        className="absolute inset-0 bg-slate-900/30 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      />

      {/* 2. Modal Card - Squircle Design */}
      <div className="relative bg-white rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.14)] w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-300 border border-slate-100">
        
        {/* 3. Header - Focused on "Overrides" */}
        <div className="px-10 pt-10 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white-50 text-black shadow-inner">
                {defaultValues?.id ? <Settings2 size={28} /> : <CalendarClock size={28} />}
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-800 tracking-tight">
                  {defaultValues?.id ? "Edit Override" : "Slot Override"}
                </h2>
                <p className="text-slate-500 text-sm font-medium">
                  Modify specific date availability
                </p>
              </div>
            </div>

            {/* Premium Close Button */}
            <button
              onClick={onClose}
              className="p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-xl transition-all border border-slate-100"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* 4. Form Content Area */}
        <div className="px-10 pb-6 pt-4">
          
             
                <SlotOverrideForm
                  onSubmit={onSubmit}
                  onCancel={onClose}
                />
        </div>
      </div>
    </div>
  );
}