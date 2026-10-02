import React, { useEffect, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Loader2,
  MessageSquare,
  Info,
  X,
} from "lucide-react";
import Button from "../ui/Button";
import TextareaField from "../ui/TextareaField";

const VARIANTS = {
  danger: {
    iconBg: "bg-gradient-to-br from-red-50 to-red-100",
    iconColor: "text-red-500",
    primaryBtn: "bg-red-600 hover:bg-red-700 shadow-red-200",
    accentBorder: "border-red-100",
    defaultIcon: AlertTriangle,
  },
  success: {
    iconBg: "bg-gradient-to-br from-emerald-50 to-emerald-100",
    iconColor: "text-emerald-600",
    primaryBtn: "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200",
    accentBorder: "border-emerald-100",
    defaultIcon: CheckCircle2,
  },
  info: {
    iconBg: "bg-gradient-to-br from-indigo-50 to-indigo-100",
    iconColor: "text-indigo-600",
    primaryBtn: "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200",
    accentBorder: "border-indigo-100",
    defaultIcon: Info,
  },
};

export default function ConfirmationDialog({
  open,
  title,
  description,
  confirmText = "Confirm Action",
  cancelText = "Go Back",
  onConfirm,
  onCancel,
  loading = false,
  variant = "danger",
  showRemark = false,
  children,
  showConfirmButton = true,
  showCancelButton = true,
  icon: CustomIcon,
}) {
  const [remark, setRemark] = useState("");
  const config = VARIANTS[variant] || VARIANTS.danger;
  const IconToShow = CustomIcon || config.defaultIcon;

  useEffect(() => {
    if (open) setRemark("");
  }, [open, title]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      {/* Ultra-smooth Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/40 backdrop-blur-[6px] animate-in fade-in duration-500"
        onClick={!loading ? onCancel : undefined}
      />

      {/* Main Dialog Card */}
      <div
        className={`
          relative bg-white w-full max-w-110 rounded-4xl 
          shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-200/60
          overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-8 duration-300
        `}
      >
        {/* Header/Icon Section */}
        <div className="pt-10 pb-6 px-8 flex flex-col items-center text-center">
          <div
            className={`
            relative mb-6 p-5 rounded-3xl ${config.iconBg} 
            border ${config.accentBorder} shadow-sm
            transition-transform duration-500 hover:rotate-6
          `}
          >
            <IconToShow
              className={`w-9 h-9 ${config.iconColor}`}
              strokeWidth={2.5}
            />
          </div>

          <h3 className="text-[24px] font-bold text-slate-900 tracking-tight leading-tight">
            {title}
          </h3>

          <div className="mt-3 px-2">
            <p className="text-slate-500 text-[15px] leading-relaxed">
              {description}
            </p>
          </div>
        </div>

        {/* Content Area */}
        <div className="px-8 pb-8 space-y-5">
          {children && (
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-sm text-slate-600 ring-1 ring-inset ring-black/5">
              {children}
            </div>
          )}

          {showRemark && (
            <div className="space-y-2.5">
              <label className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                <MessageSquare className="w-3.5 h-3.5" />
                Additional Remarks
              </label>
              <div className="relative group">
                <TextareaField
                  placeholder="Tell us why..."
                  value={remark}
                  onChange={(e) => setRemark(e.target.value)}
                  rows={3}
                  isDisabled={loading}
                  className="w-full rounded-2xl border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-slate-100 transition-all resize-none p-4"
                />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            {showCancelButton && (
              <button
                disabled={loading}
                onClick={onCancel}
                className="
                  flex-1 order-2 sm:order-1 px-6 py-4 text-[15px] font-semibold text-slate-600 
                  bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl
                  transition-all active:scale-[0.98] disabled:opacity-50
                "
              >
                {cancelText}
              </button>
            )}

            {showConfirmButton && (
              <Button
                disabled={loading || (showRemark && !remark.trim())}
                text={confirmText}
                onClick={() => onConfirm(remark)}
                className={`
                  flex-[1.2] order-1 sm:order-2 px-6 py-4 text-[15px] font-bold text-white 
                   rounded-2xl shadow-xl
                  transition-all active:scale-[0.98] hover:-translate-y-0.5
                  disabled:opacity-50 disabled:grayscale disabled:transform-none
                  flex items-center justify-center gap-2
                `}
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  confirmText
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Subtle Bottom Accent */}
      </div>
    </div>
  );
}