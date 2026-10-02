"use client";

import React from "react";
import { motion } from "framer-motion";

export default function FullPageLoader({ message = "Loading Heritage..." }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gradient-to-br from-[#071633] to-[#040d1f] text-center p-4"
        > 
            <div className="absolute inset-0 opacity-[0.05] bg-mandala pointer-events-none scale-110" />

            <div className="relative flex flex-col items-center gap-6 z-10"> 
                <div className="relative w-16 h-16">
                    <div className="absolute inset-0 border-4 border-gold/10 rounded-full" />
                    <div className="absolute inset-0 border-4 border-t-gold border-r-gold/50 rounded-full animate-spin" />
                </div>

                <div className="space-y-1">
                    <p className="font-serif text-gold text-lg xl:text-xl tracking-widest animate-pulse font-medium">
                        {message}
                    </p>
                    <p className="text-[9px] tracking-[4px] uppercase font-sans text-sandstone/40">
                        Please wait while we prepare your gateway
                    </p>
                </div>
            </div>
        </motion.div>
    );
}