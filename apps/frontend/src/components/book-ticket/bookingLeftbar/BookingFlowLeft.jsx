"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Calendar, Clock, Users, Info, Sparkles } from "lucide-react";

export default function BookingFlowLeft({ place, itemVariants }) {
  console.log(place);

  const events = [
    {
      title: "Classes 6th to 12th & Alumni",
      date: "16 October 2026",
      time: "6:00 PM – 11:00 PM",
      details: [
        "Eligible: Class 6 to Class 12 students and alumni",
        "Male Entry Fee: ₹350 per person",
        "Female Entry Fee: ₹350 per person",
        "Parents: Not allowed Dandiya Sticks",
        "Pair of Dandiya Sticks: ₹50 per pair",
      ],
    },
    {
      title: "Nursery to Class 5th",
      date: "17 October 2026",
      time: "6:00 PM – 11:00 PM",
      details: [
        "Eligible: Nursery to Class 5 students",
        "Entry Fee: ₹350 per person",
        "Parents: Allowed",
        "Parent Entry Fee: ₹350 per person",
        "Pair of Dandiya Sticks: ₹50 per pair",
      ],
    },
  ];

  return (
    <motion.section
      className="
        w-full
        lg:w-1/2
        min-h-[320px]
        sm:min-h-[400px]
        lg:h-full
        lg:min-h-0
        bg-gradient-to-b from-royal-blue to-[#071633]
        flex
        flex-col
        items-center
        justify-between
        px-5 py-6
        sm:px-8 sm:py-8
        lg:p-8
        overflow-hidden
        select-none
        relative
        border-r
        border-gold/10
        shrink-0
      "
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.12] bg-mandala pointer-events-none scale-105" />

      {/* Radial glow behind heading */}
      <div className="absolute top-[15%] left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-gold/5 rounded-full blur-3xl pointer-events-none" />

      {/* Decorative Stars */}
      <div className="absolute top-3 left-4 sm:top-4 sm:left-6 text-gold/20 font-serif text-lg sm:text-xl select-none">
        ✦
      </div>
      <div className="absolute top-3 right-4 sm:top-4 sm:right-6 text-gold/20 font-serif text-lg sm:text-xl select-none">
        ✦
      </div>
      <div className="absolute bottom-3 left-4 sm:bottom-4 sm:left-6 text-gold/15 font-serif text-base sm:text-lg select-none">
        ✦
      </div>
      <div className="absolute bottom-3 right-4 sm:bottom-4 sm:right-6 text-gold/15 font-serif text-base sm:text-lg select-none">
        ✦
      </div>

      {/* Location */}
      <motion.div
        variants={itemVariants}
        className="
          relative z-10
          mb-4
          border-2 border-gold/25
          px-4 py-2
          sm:px-5 sm:py-2
          text-center
          bg-[#071633]/50
          backdrop-blur-xl
          rounded-xl
          w-full
          max-w-[320px]
          sm:max-w-[380px]
          shrink-0
          shadow-[0_10px_30px_rgba(0,0,0,0.15)]
        "
      >
        <p className="text-white text-xs sm:text-sm font-serif tracking-wide truncate max-w-full">
          {place?.location || "Jaipur, Rajasthan"}
        </p>
      </motion.div>

      {/* Main Content */}
      <div
        className="
          text-center
          z-10
          w-full
          max-w-[620px]
          shrink-0
          flex
          flex-col
          items-center
          justify-center
          py-2
          sm:py-4
          lg:my-auto
        "
      >
        {/* Heading */}
        <motion.h1
          variants={itemVariants}
          className="
            text-white
            font-serif
            text-xl
            sm:text-2xl
            md:text-3xl
            xl:text-4xl
            leading-tight
            font-normal
            tracking-wide
          "
        >
          Welcome to
          <br />
          <span
            className="
              bg-gradient-to-r
              from-gold
              via-jaipur-pink
              to-gold
              bg-clip-text
              text-transparent
              font-medium
              inline-block
              mt-1
              max-w-full
              break-words
            "
          >
            {place?.name || "Dandiya Night"}
          </span>
        </motion.h1>

        {/* Divider */}
        <div className="h-[1px] w-12 sm:w-16 bg-gradient-to-r from-transparent via-gold/40 to-transparent my-3 sm:my-4" />

        {/* ============================================================
            EVENT DETAILS — EQUAL HEIGHT HORIZONTAL CARDS
        ============================================================ */}
        <motion.div
          variants={itemVariants}
          className="
            w-full
            grid
            grid-cols-1
            md:grid-cols-2
            gap-4
            mt-1
            items-stretch
          "
        >
          {events.map((event, index) => (
            <div
              key={index}
              className="
                group
                relative
                w-full
                h-full
                flex
                flex-col
                text-left
                rounded-2xl
                border border-gold/25
                bg-gradient-to-br from-[#0a1d3d]/70 to-[#071633]/90
                backdrop-blur-xl
                p-4
                sm:p-5
                shadow-[0_10px_30px_-8px_rgba(0,0,0,0.5)]
                overflow-hidden
                transition-all
                duration-300
                hover:border-gold/50
                hover:shadow-[0_15px_40px_-8px_rgba(212,175,55,0.25)]
              "
            >
              {/* Gold accent bar */}
              <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-gold via-jaipur-pink to-gold opacity-70 group-hover:opacity-100 transition-opacity" />

              {/* Corner star */}
              <div className="absolute top-2 right-3 text-gold/25 font-serif text-[10px] select-none group-hover:text-gold/50 transition-colors">
                ✦
              </div>

              {/* Event Title */}
              <div className="flex items-start gap-2 mb-3">
                <div className="w-7 h-7 rounded-full bg-gold/15 border border-gold/40 flex items-center justify-center shrink-0 mt-0.5">
                  <Users size={13} className="text-gold" />
                </div>
                <h3
                  className="
                    text-gold
                    font-serif
                    font-bold
                    text-[13px]
                    sm:text-sm
                    tracking-wide
                    leading-snug
                    flex-1
                  "
                >
                  {event.title}
                </h3>
              </div>

              {/* Date & Time */}
              <div className="flex flex-col gap-1.5 mb-3 pl-1">
                <div className="flex items-center gap-2">
                  <Calendar size={12} className="text-gold/70 shrink-0" />
                  <span className="text-sandstone/90 text-[11px] sm:text-xs font-medium">
                    {event.date}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={12} className="text-gold/70 shrink-0" />
                  <span className="text-sandstone/90 text-[11px] sm:text-xs font-medium">
                    {event.time}
                  </span>
                </div>
              </div>

              {/* Divider */}
              <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-gold/20 to-transparent mb-3" />

              {/* Details List */}
              <ul className="flex flex-col gap-2 flex-1">
                {event.details.map((detail, i) => (
                  <li
                    key={i}
                    className="
                      flex
                      items-start
                      gap-2.5
                      text-sandstone/85
                      text-[11px]
                      leading-relaxed
                    "
                  >
                    <span className="text-gold mt-1.5 shrink-0 text-[6px]">
                      ◆
                    </span>
                    <span className="flex-1">{detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </motion.div>


        
      </div>

      {/* ============================================================
          PLACE IMAGE — Bottom, fully visible
      ============================================================ */}
      <motion.div
        variants={itemVariants}
        whileHover={{
          scale: 1.01,
          borderColor: "rgba(212,175,55,0.45)",
        }}
        className="
          relative z-10
          w-full
          max-w-[340px]
          sm:max-w-[400px]
          lg:max-w-[440px]

          h-[120px]
          sm:h-[140px]
          md:h-[160px]
          lg:h-[160px]
          xl:h-[180px]

          p-1.5
          bg-sandstone/5
          rounded-[18px]
          sm:rounded-[24px]
          border border-gold/20
          shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)]
          shrink-0
          overflow-hidden
          flex
          items-center
          justify-center
          mt-5
        "
      >
        {place?.imageUrl ? (
          <Image
            width={450}
            height={320}
            priority
            alt={place?.name || "Place Image"}
            className="
              w-full
              h-full
              object-cover
              rounded-[14px]
              sm:rounded-[18px]
              select-none
            "
            src={place.imageUrl}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-sandstone/50 text-xs">
            No image available
          </div>
        )}
      </motion.div>
    </motion.section>
  );
}