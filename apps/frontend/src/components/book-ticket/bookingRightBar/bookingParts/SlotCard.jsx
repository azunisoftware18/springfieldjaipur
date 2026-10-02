"use client";
import React from "react";
import { motion } from "framer-motion";

export default function SlotCard({ slots, selectedSlot, onSelect }) {
    const categories = ["Morning", "Afternoon", "Evening"];

    const getCategory = (time) => {
        const hour = Number(time?.split(":")[0]);
        if (hour < 12) return "Morning";
        if (hour < 17) return "Afternoon";
        return "Evening";
    };

    return (
        <div className="space-y-6">
            {categories.map((cat) => {
                const filteredSlots = slots?.filter((slot) => getCategory(slot.time) === cat);
                if (!filteredSlots || filteredSlots.length === 0) return null;

                return (
                    <div key={cat} className="space-y-3 lg:space-y-4"> 
                        <div className="flex items-center gap-3 px-1">
                            <span className="text-xs sm:text-sm font-bold text-gold uppercase tracking-[2px] font-serif whitespace-nowrap">
                                ✦ {cat} Slots
                            </span>
                            <div className="flex-1 h-[1px] bg-gradient-to-r from-gold/30 via-transparent to-transparent" />
                        </div>
 
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 px-1 ">
                            {filteredSlots.map((slot, index) => {
                                const isFull = slot.available === 0;
                                const isDisabled = !slot.isAvailable || isFull;
                                const isSelected = selectedSlot?.time === slot.time;

                                const getStatusText = () => {
                                    if (!slot.isAvailable && !isFull) return "⏳ EXPIRED";
                                    if (isFull) return "🚫 FULL BOOKED";
                                    return `👤 ${slot.available} Seats Left`;
                                };

                                return (
                                    <motion.button
                                        key={slot.time || index}
                                        whileHover={!isDisabled ? { scale: 1.02, translateY: -2 } : {}}
                                        whileTap={!isDisabled ? { scale: 0.98 } : {}}
                                        disabled={isDisabled}
                                        onClick={() => onSelect(slot)}
                                        className={`flex px-4 py-3.5 sm:p-4 items-center justify-center rounded-xl transition-all duration-300 relative select-none sm:w-full w-auto mx-0 border
                                            ${isSelected
                                                ? "border-gold bg-gradient-to-br from-royal-blue to-[#112952] text-white shadow-lg shadow-royal-blue/20"
                                                : "border-gold/20 bg-white hover:border-gold/50 text-royal-blue shadow-sm hover:shadow-md"
                                            } 
                                            ${isDisabled
                                                ? "opacity-50 cursor-not-allowed bg-sandstone/30 border-gray-200 grayscale hover:shadow-none"
                                                : "cursor-pointer"
                                            }`}
                                    >
                                        <div className="space-y-1 text-left flex-1 pr-2">
                                            <p className={`font-serif text-sm sm:text-base font-semibold tracking-wide truncate ${isSelected ? "text-gold" : "text-royal-blue"}`}>
                                                {slot.displayTime || slot.time}
                                            </p>
                                            <p className={`text-[10px] sm:text-[11px] font-bold tracking-wider uppercase font-sans truncate
                                                ${isSelected ? "text-white/80" : ""}
                                                ${isDisabled ? "text-gray-500" : isFull ? "text-red-500" : "text-jaipur-dark"}
                                            `}>
                                                {getStatusText()}
                                            </p>
                                        </div>

                                        {/* Radio Indicator */}
                                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors duration-300 shrink-0
                                            ${isSelected ? "border-gold bg-gold" : "border-royal-blue/30 bg-sandstone/30"}`}>
                                            {isSelected && (<div className="w-2.5 h-2.5 bg-royal-blue rounded-full" />)}
                                        </div>
                                    </motion.button>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}