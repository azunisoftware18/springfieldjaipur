"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Scale, FileWarning, CalendarDays, Ban, ArrowLeft } from "lucide-react";

export default function TermsAndConditions() {
    return (
        <div className="min-h-screen bg-sandstone/20 py-12 px-4 sm:px-6 lg:px-8 select-none">
            <div className="absolute inset-0 opacity-[0.03] bg-mandala pointer-events-none scale-105" />
            <div className="max-w-4xl mx-auto z-10 relative space-y-8">

                {/* Back to Gateway Trigger */}
                {/* <div className="flex justify-start">
                    <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold font-serif tracking-[2px] text-royal-blue/60 hover:text-royal-blue uppercase transition-colors group">
                        <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" /> Back To Home Gateway
                    </Link>
                </div> */}
 
                <div className="text-center space-y-2">
                    <div className="flex justify-center mb-2">
                        <div className="h-14 w-14 rounded-full bg-royal-blue/10 border border-gold/20 flex items-center justify-center text-royal-blue shadow-inner">
                            <Scale size={26} className="text-royal-blue" />
                        </div>
                    </div>
                    <p className="text-[10px] tracking-[5px] text-jaipur-dark uppercase font-extrabold font-sans">Legal Governance</p>
                    <h1 className="text-3xl sm:text-4xl font-serif text-royal-blue font-bold tracking-wide">Terms & Conditions</h1>
                    <div className="h-[1px] w-16 bg-gold/40 mx-auto mt-3" />
                    <p className="text-xs text-gray-400 font-sans mt-1">Effective Date: May 2026</p>
                </div>
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white rounded-3xl border border-gold/20 p-6 sm:p-10 shadow-[0_20px_50px_rgba(11,33,73,0.04)] space-y-8 text-left"
                >
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-royal-blue">
                            <FileWarning size={20} className="text-gold shrink-0" />
                            <h2 className="text-xl font-serif font-bold tracking-wide">1. Acceptance of Terms</h2>
                        </div>
                        <p className="text-sm leading-[1.8] text-gray-600 font-sans font-normal pl-7">
                            By accessing, reviewing, or booking admission entry passes through this portal, you explicitly acknowledge and agree to comply with these comprehensive Terms and Conditions. If you disagree with any segment of this legal framework, you must cease processing ticket reservations immediately.
                        </p>
                    </div>
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-royal-blue">
                            <CalendarDays size={20} className="text-gold shrink-0" />
                            <h2 className="text-xl font-serif font-bold tracking-wide">2. Booking Regulations & Ticket Validation</h2>
                        </div>
                        <p className="text-sm leading-[1.8] text-gray-600 font-sans font-normal pl-7">
                            All electronic gate passes issued are time-stamped and bound strictly to the selected <strong>Date of Visit</strong> and <strong>Session Entry Slot</strong>.
                        </p>
                        <ul className="list-disc pl-14 text-sm text-gray-600 space-y-2 font-sans font-normal">
                            <li>Each booking requires accurate visitor identity configuration matching official government IDs.</li>
                            <li>Tickets are non-transferable and cannot be resold under any unofficial commercial marketing pipelines.</li>
                            <li>Children under the age of 5 receive complimentary access but must be declared during checkout bounds.</li>
                        </ul>
                    </div>
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-royal-blue">
                            <Ban size={20} className="text-gold shrink-0" />
                            <h2 className="text-xl font-serif font-bold tracking-wide">3. Cancellation & Absolute No-Refund Policy</h2>
                        </div>
                        <p className="text-sm leading-[1.8] text-gray-600 font-sans font-normal pl-7">
                            Please carefully re-verify your total ticket quantities, guide add-ons, and session slots before triggering payment configurations. Once transactions are authenticated and confirmed via our gateway provider (Easebuzz), <strong>all sales are strictly absolute</strong>. No requests for cash refunds, booking cancellations, or scheduled timing adjustments will be processed under standard operations.
                        </p>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-royal-blue">
                            <Scale size={20} className="text-gold shrink-0" />
                            <h2 className="text-xl font-serif font-bold tracking-wide">4. Park & Monument Code of Conduct</h2>
                        </div>
                        <p className="text-sm leading-[1.8] text-gray-600 font-sans font-normal pl-7">
                            Visitors must adhere strictly to environmental preservation codes while present at the heritage reserves or Kishan Bagh eco-tracks. Littering, damaging natural sand structures, harming native vegetation, or stepping outside designated elevated walkways is strictly prohibited and can invite penalty actions from forest authorities.
                        </p>
                    </div>

                    <div className="space-y-3 border-t border-gold/15 pt-6">
                        <h3 className="text-base font-serif font-bold text-royal-blue tracking-wide">5. Limitation of Liability</h3>
                        <p className="text-xs sm:text-sm leading-[1.6] text-gray-500 font-sans pl-1">
                            The administration reserves the right to modify operating hours or temporarily close trails due to extreme weather conditions, critical security protocols, or VIP updates. In such exceptional instances, entry updates will be communicated, and compensation layouts will fall strictly under governing board jurisdiction.
                        </p>
                    </div>
                </motion.div>

                <div className="text-center font-serif italic text-xs text-royal-blue/50 select-none">
                    © 2026 Jaipur Heritage Reserves Portal. All Rights Reserved.
                </div>
            </div>
        </div>
    );
}