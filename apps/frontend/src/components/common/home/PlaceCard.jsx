"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function PlaceCard({ place }) {
    return (
        <motion.div
            whileHover={{ y: -8 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl border border-gray-100 flex flex-col h-full select-none text-left"
        >
            <div className="relative h-[220px] overflow-hidden bg-gray-50">
                <img
                    src={place?.images?.[0] || place?.image}
                    alt={place?.name}
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
                <span className="absolute top-4 left-4 bg-jaipur-blue text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md shadow-sm">
                    {place?.location || "Jaipur"}
                </span>
            </div>

            <div className="p-5 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-jaipur-blue font-serif line-clamp-1">
                    {place?.name}
                </h3>

                <p className="text-gray-500 text-xs sm:text-sm mt-2 line-clamp-2 leading-relaxed">
                    {place?.shortDescription || "Discover the incredible flora, fauna, and royal remnants structured beautifully in this historical trail."}
                </p>

                <div className="flex items-center gap-4 my-4 pt-4 border-t border-gray-100 text-[11px] text-gray-500 font-medium">
                    <span className="flex items-center gap-1">⏱ {place?.duration || "2 Hours"}</span>
                    <span className="flex items-center gap-1">🚶‍♂️ {place?.difficulty || "Easy Access"}</span>
                </div>

                <div className="mt-auto flex items-center justify-between pt-2">
                    <div className="flex flex-col">
                        <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Entry Pass</span>
                        <span className="text-jaipur-blue font-extrabold text-lg font-mono">{place?.fee || "₹50"}</span>
                    </div>

                    <Link
                        href={`/book-tickets/${place?.id || place?._id}`}
                        className="bg-jaipur-pink hover:bg-jaipur-pinkDark text-white px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-sm shadow-jaipur-pink/20"
                    >
                        Book Pass
                    </Link>
                </div>
            </div>
        </motion.div>
    );
}