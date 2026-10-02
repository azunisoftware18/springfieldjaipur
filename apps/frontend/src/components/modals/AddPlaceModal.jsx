"use client";

import React from "react";
import { X, MapPin } from "lucide-react";
import AddPlaceForm from "../form/AddPlaceForm";

export default function AddPlaceModal({
  open,
  onClose,
  onSubmit,
  defaultValues,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-1000 flex items-center justify-center p-4">
      {/* Background Overlay - Wapis standard neutral background */}
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div
        style={{
          backgroundColor: "hsl(var(--card))",
          borderColor: "hsl(var(--border))",
        }}
        className="
relative
w-full
max-w-3xl
max-h-[90vh]
overflow-hidden
rounded-[2.5rem]
shadow-2xl
z-10
bg-white
animate-in fade-in zoom-in-95 duration-200
flex flex-col
"
      >
        {/* HEADER - Sirf yahan color #ec003f apply kiya hai */}
        <div
          style={{ backgroundColor: "white" }}
          className="px-8 py-9 text-black relative"
        >
          <div className="flex items-center gap-4">
            <div className="bg-white/20 backdrop-blur-md p-3 rounded-2xl border border-white/10 shadow-inner">
              <MapPin size={24} className="text-black" />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-black">
                {defaultValues?.id ? "Edit Destination" : "New Destination"}
              </h2>
              <p className="text-black/80 text-sm">Create a memorable spot</p>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-black/20 border border-white/10 rounded-xl transition-all group"
          >
            <X
              size={18}
              className="text-black group-hover:rotate-90 transition-transform duration-200"
            />
          </button>
        </div>

        {/* Content Area - No changes here */}
        <div className="flex-1 overflow-y-auto">
          <AddPlaceForm
            onSubmit={onSubmit}
            defaultValues={defaultValues}
            onCancel={onClose}
          />
        </div>
      </div>
    </div>
  );
}
