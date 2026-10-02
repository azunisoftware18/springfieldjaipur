"use client";

import { X, Clock, PlusCircle } from "lucide-react";
import SlotTemplateForm from "../form/SlotTemplateForm";

export default function SlotTemplateModal({
  open,
  onClose,
  onSubmit,
  defaultValues,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-4">
      {/* 1. Smooth Backdrop Layer */}
      <div
        className="absolute inset-0 bg-slate-900/30 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      />

      {/* 2. Modal Card - Redesigned with Smooth Corners */}
      <div className="relative bg-white rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.14)] w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-300 border border-slate-100">
        
        {/* 3. Header - Soft Sky Blue & Clean Design */}
        <div className="px-8 pt-8 pb-4 ">
          <div className="flex items-center justify-between ">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-sky-600 shadow-inner">
                {defaultValues?.id ? <Clock size={24} /> : <PlusCircle size={24} />}
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-800 tracking-tight">
                  {defaultValues?.id ? "Edit Slot" : "Create Slot"}
                </h2>
                <p className="text-slate-500 text-sm font-medium">
                  Set timing and capacity
                </p>
              </div>
            </div>

            {/* Elegant Close Button */}
            <button
              onClick={onClose}
              className="p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-xl transition-all border border-slate-100"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* 4. Form Content - Nested Layout for Better Corners */}
        <div className="px-8 pb-2 pt-4">
          <div className="rounded-[1.75rem] bg-slate-50/50 p-1.5 border border-slate-50">
                <SlotTemplateForm
                  onSubmit={onSubmit}
                  onCancel={onClose}
                  defaultValues={defaultValues}
                />
          </div>
        </div>
      </div>
    </div>
  );
}