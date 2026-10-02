"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function BookingFlowLeft({ place, itemVariants }) {
    console.log(place);
    
    return (
        <motion.section
            className="hidden lg:flex w-1/2 h-full bg-gradient-to-b from-royal-blue to-[#071633] flex-col items-center justify-between p-8 overflow-hidden select-none relative border-r border-gold/10 shrink-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}>
            <div className="absolute inset-0 opacity-[0.12] bg-mandala pointer-events-none scale-105"></div>
            <div className="absolute top-4 left-6 text-gold/20 font-serif text-xl select-none">✦</div>
            <div className="absolute top-4 right-6 text-gold/20 font-serif text-xl select-none">✦</div>
            <motion.div
                variants={itemVariants}
                className="mb-2 border-2 border-gold/25 px-5 py-2 text-center bg-[#071633]/50 backdrop-blur-xl rounded-xl max-w-full shrink-0 shadow-[0_10px_30px_rgba(0,0,0,0.15)]">
                <p className="text-[9px] tracking-[5px] text-gold uppercase font-bold mb-0.5"></p>
                <p className="text-white text-sm sm:text-base font-serif tracking-wide truncate max-w-[280px]">{place?.location || "Jaipur, Rajasthan"}</p>
            </motion.div>

            <div className="text-center z-10 max-w-[450px] w-full shrink-0 my-auto flex flex-col items-center py-4">
                <motion.h1
                    variants={itemVariants}
                    className="text-white font-serif text-2xl xl:text-4xl leading-tight font-normal tracking-wide">
                    Welcome to <br />
                    <span className="bg-gradient-to-r from-gold via-jaipur-pink to-gold bg-clip-text text-transparent font-medium inline-block mt-1">
                        {place?.name}
                    </span>
                </motion.h1>
                <div className="h-[1px] w-16 bg-gradient-to-r from-transparent via-gold/40 to-transparent my-3" />
                <motion.p
                    variants={itemVariants}
                    className="text-sandstone/80 text-xs xl:text-sm font-light leading-relaxed italic px-4 w-full break-words line-clamp-3 overflow-hidden text-ellipsis font-serif">
                    "{place?.shortDescription}"
                </motion.p>
            </div>
            <motion.div
                variants={itemVariants}
                whileHover={{ scale: 1.01, borderColor: "rgba(212,175,55,0.35)" }}
                className="w-full max-w-[380px] h-[220px] xl:h-[260px] p-1.5 bg-sandstone/5 rounded-[24px] border border-gold/20 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] shrink-0 overflow-hidden relative flex items-center justify-center">
                <Image
                    width={450}
                    height={320}
                    priority
                    alt={place?.name || "Place Image"}
                    className="w-full h-full object-cover rounded-[18px] select-none"
                    src={place?.imageUrl}
                />
            </motion.div>
        </motion.section>
    );
} 