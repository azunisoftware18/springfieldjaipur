"use client";

import React, { Suspense } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { AlertCircle, ArrowLeft } from "lucide-react";
import Status from "@/components/book-ticket/bookingRightBar/bookingParts/Status";
import { usePlace } from "@/hooks/useCurrentPlace";

function FailureContent() {
    const router = useRouter();

    const { placeId } = usePlace();

    const handleRetry = () => {
        if (placeId) {
            router.push(`/book-tickets/${placeId}`);
        }
    };
    return (
        <div className="h-screen w-full flex items-center justify-center px-4 py-3 bg-sandstone relative overflow-hidden select-none">
            <div className="absolute inset-0 opacity-[0.03] bg-mandala pointer-events-none scale-105"></div>
            <div className="w-full max-w-xl text-center z-10 flex flex-col justify-center items-center space-y-4 max-h-full">
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 140, damping: 18 }}
                    className="relative w-full bg-white p-6 sm:p-10 rounded-[2.5rem] border border-red-200/40 shadow-[0_20px_50px_rgba(195,90,64,0.05)] overflow-hidden flex flex-col"
                >
                    <div className="absolute inset-2 border border-red-500/5 rounded-[2rem] pointer-events-none"></div>
                    <div className="absolute inset-3 border border-dashed border-red-500/5 rounded-[2rem] pointer-events-none"></div>

                    <div className="flex justify-center mb-1 shrink-0">
                        <div className="inline-flex items-center gap-1.5 bg-red-50 border border-red-200/50 px-3 py-1 rounded-full text-red-600 text-[10px] uppercase tracking-widest font-sans font-bold shadow-sm">
                            <AlertCircle size={12} className="animate-pulse" /> Transaction Aborted
                        </div>
                    </div>

                    <div className="my-2 py-2 shrink-0">
                        <Status
                            status="failed"
                            onRetry={handleRetry}
                        />
                    </div>

                    <div className="relative w-full px-4 my-2 shrink-0">
                        <div className="w-full border-t border-dashed border-red-200/30"></div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.25, duration: 0.4 }}
                        className="pt-2 shrink-0 max-w-xs w-full mx-auto"
                    >
                        <button
                            onClick={() => router.push("/")}
                            className="w-full inline-flex items-center justify-center gap-2 text-gray-400 font-bold font-serif uppercase tracking-[2px] text-xs hover:text-royal-blue transition-colors py-2 group cursor-pointer"
                        >
                            <ArrowLeft size={13} className="group-hover:-translate-x-0.5 transition-transform" /> Cancel and Go Home
                        </button>
                    </motion.div>
                </motion.div>

                <div className="text-center font-serif italic text-[10px] text-royal-blue/30 select-none tracking-wide">
                    If funds were deducted, ledger credits will reverse automatically via Easebuzz within 24 hours.
                </div>
            </div>
        </div>
    );
}

export default function PaymentFailurePage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-sandstone font-serif italic text-royal-blue/70 animate-pulse tracking-widest text-sm uppercase">
                Verifying Vault Ledger...
            </div>
        }>
            <FailureContent />
        </Suspense>
    );
}