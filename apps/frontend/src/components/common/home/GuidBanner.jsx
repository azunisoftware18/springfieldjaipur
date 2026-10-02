"use client";

import React from 'react';
import { motion } from "framer-motion"; 
 
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.12,  
            delayChildren: 0.1
        }
    }
};

const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.98 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { type: "spring", stiffness: 100, damping: 16 }
    }
};

export default function GuidBanner() {
    return (
        <>
            <section className="py-16 md:py-24 mt-20 md:mt-28 bg-white border-y border-[#F4F1DE]/60 overflow-hidden select-none">
                <div className="max-w-6xl mx-auto px-4 text-center">

                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                    >
                        <p className="text-[#E07A5F] uppercase tracking-[4px] text-xs font-bold mb-2 font-sans">Easy Steps</p>
                        <h2 className="text-3xl sm:text-4xl font-bold text-[#1A365D] font-serif mb-16 tracking-wide">How to Book Your Entry Ticket</h2>
                    </motion.div>

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-80px" }}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8" >
                        {[
                            {
                                step: "01",
                                title: "Explore Destinations",
                                desc: "Discover Jaipur’s famous forts, museums, wildlife parks, and cultural attractions from one platform."
                            },
                            {
                                step: "02",
                                title: "Select Visit Date",
                                desc: "Choose your preferred travel date and plan your visit according to available schedules."
                            },
                            {
                                step: "03",
                                title: "Choose Entry Slot",
                                desc: "Pick from available morning, afternoon, or evening entry sessions for a smooth experience."
                            },
                            {
                                step: "04",
                                title: "Fill Visitor Details",
                                desc: "Enter visitor information, ticket quantity, and additional booking preferences securely."
                            },
                            {
                                step: "05",
                                title: "Secure Online Payment",
                                desc: "Complete your booking using a fast and secure digital payment gateway experience."
                            },
                            {
                                key: 5,
                                step: "06",
                                title: "Download QR E-Ticket",
                                desc: "Receive your instant digital ticket with QR verification for quick and hassle-free entry."
                            }
                        ].map((item, idx) => (
                            <motion.div
                                key={idx}
                                variants={cardVariants}
                                whileHover={{ y: -6, boxShadow: "0px 20px 40px rgba(26,54,93,0.06)", borderColor: "rgba(224,122,95,0.25)" }}
                                className="bg-[#F4F1DE]/20 p-8 rounded-2xl text-left relative border border-[#F4F1DE]/50 transition-all duration-300 group">
                                <span className="text-5xl sm:text-6xl font-extrabold text-[#E07A5F]/10 absolute top-4 right-6 font-serif group-hover:text-[#E07A5F]/15 group-hover:scale-105 transition-all duration-300">
                                    {item.step}
                                </span>
                                <h4 className="text-lg font-bold text-[#1A365D] font-serif mt-4 tracking-wide group-hover:text-[#E07A5F] transition-colors">
                                    {item.title}
                                </h4>
                                <p className="text-gray-600 text-sm mt-2 leading-relaxed font-sans font-normal">
                                    {item.desc}
                                </p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>
        </>
    );
}