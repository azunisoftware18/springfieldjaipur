"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ShieldCheck, Lock, Eye, FileText, ArrowLeft } from "lucide-react";

export default function PrivacyPolicy() {
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
              <ShieldCheck size={28} className="text-royal-blue" />
            </div>
          </div>
          <p className="text-[10px] tracking-[5px] text-jaipur-dark uppercase font-extrabold font-sans">Legal Registry</p>
          <h1 className="text-3xl sm:text-4xl font-serif text-royal-blue font-bold tracking-wide">Privacy Policy</h1>
          <div className="h-[1px] w-16 bg-gold/40 mx-auto mt-3" />
          <p className="text-xs text-gray-400 font-sans mt-1">Last Updated: May 2026</p>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-3xl border border-gold/20 p-6 sm:p-10 shadow-[0_20px_50px_rgba(11,33,73,0.04)] space-y-8 text-left"
        >
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-royal-blue">
              <Eye size={20} className="text-gold shrink-0" />
              <h2 className="text-xl font-serif font-bold tracking-wide">1. Overview & Information We Collect</h2>
            </div>
            <p className="text-sm leading-[1.8] text-gray-600 font-sans font-normal pl-7">
              Welcome to the official Heritage & Nature Trail reservation gateway. We respect your confidentiality and are committed to safeguarding your personal data. When you reserve gate passes through our portal, we collect basic administrative information required for booking confirmation, including your <strong>Full Name</strong>, <strong>Email Address</strong>, and <strong>Mobile Number</strong>.
            </p>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-royal-blue">
              <FileText size={20} className="text-gold shrink-0" />
              <h2 className="text-xl font-serif font-bold tracking-wide">2. Purpose of Data Processing</h2>
            </div>
            <p className="text-sm leading-[1.8] text-gray-600 font-sans font-normal pl-7">
              The personal infrastructure information shared during pass configuration is strictly utilized to:
            </p>
            <ul className="list-disc pl-14 text-sm text-gray-600 space-y-2 font-sans font-normal">
              <li>Generate and transmit secure E-Tickets directly to your verified email address.</li>
              <li>Send essential real-time operational or session threshold alerts via SMS/Mobile networks.</li>
              <li>Validate real guest identities at the monument or nature reserve entry checkpoints.</li>
            </ul>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-royal-blue">
              <Lock size={20} className="text-gold shrink-0" />
              <h2 className="text-xl font-serif font-bold tracking-wide">3. Transaction & Payment Security</h2>
            </div>
            <p className="text-sm leading-[1.8] text-gray-600 font-sans font-normal pl-7">
              All registration fares and payments are routed safely through our integrated payment provider, <strong>Easebuzz</strong>. Our portal does not capture, store, or possess access to your confidential financial details, bank accounts, or credit/debit card infrastructure credentials. Transactions are executed within an isolated, bank-grade encrypted environment.
            </p>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-royal-blue">
              <ShieldCheck size={20} className="text-gold shrink-0" />
              <h2 className="text-xl font-serif font-bold tracking-wide">4. Data Retention & Third-Party Shares</h2>
            </div>
            <p className="text-sm leading-[1.8] text-gray-600 font-sans font-normal pl-7">
              We never trade, rent, or lease your personal identity tokens to third-party commercial marketing platforms. Data is securely retained within our isolated databases solely to preserve booking histories or meet necessary state regulatory audits. We store cookies temporarily to recognize step configurations during active ticket workflows.
            </p>
          </div>
          <div className="space-y-3 border-t border-gold/15 pt-6">
            <h3 className="text-base font-serif font-bold text-royal-blue tracking-wide">Contact Grievance Desk</h3>
            <p className="text-xs sm:text-sm leading-[1.6] text-gray-500 font-sans pl-1">
              For identity corrections, data removal inquiries, or booking log concerns, feel free to reach out to our administration network support at <span className="text-jaipur-dark font-medium underline cursor-pointer">info@azzunique.com </span>.
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