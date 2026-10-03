"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import BookingFlowRight from "@/components/book-ticket/bookingRightBar/BookingFlowRight";
import BookingFlowLeft from "@/components/book-ticket/bookingLeftbar/BookingFlowLeft";
import FullPageLoader from "@/components/ui/FullPageLoader";
import { usePlaceById } from "@/hooks/usePlace";
import { setCurrentPlace } from "@/store/slices/placeSlice";
import { X, ShieldCheck } from "lucide-react";

export default function Page() {
  const { placeId } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();

  const { data: place, isLoading } = usePlaceById(placeId);

  useEffect(() => {
    if (place) {
      dispatch(setCurrentPlace(place));
    }
  }, [place, dispatch]);

  useEffect(() => {
    if (place?.name) {
      document.title = `${place.name} | Ticket Booking`;
    }
  }, [place]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && <FullPageLoader message="Loading Heritage..." />}
      </AnimatePresence>

      {!isLoading && !place && (
        <div className="min-h-screen flex items-center justify-center bg-sandstone">
          <div className="text-center bg-white p-8 rounded-2xl border border-gold/20 shadow-xl max-w-sm">
            <h1 className="text-2xl font-serif font-bold text-red-500 mb-2">
              Place Not Found
            </h1>
            <p className="text-gray-500 text-sm mb-5">
              Invalid Place ID or connection issue.
            </p>
            <button
              onClick={() => router.push("/")}
              className="px-5 py-2.5 bg-[#071633] text-white text-xs font-serif tracking-widest uppercase rounded-xl border border-gold/30"
            >
              Go Back Home
            </button>
          </div>
        </div>
      )}

      {!isLoading && place && (
        <motion.div
          className="
                        flex
                        bg-sandstone
                        flex-col
                        w-full
                        min-h-screen
                        lg:h-screen
                        lg:max-h-screen
                        lg:overflow-hidden
                        lg:fixed
                        lg:inset-0
                        lg:z-50
                        relative
                    "
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/*
                    <div className="w-full bg-[#071633] border-b border-gold/10 px-4 sm:px-6 py-2 flex items-center justify-between z-50 shrink-0 select-none">
                        <div className="flex items-center gap-1.5 text-[9px] uppercase tracking-[3px] text-sandstone/60 font-bold font-sans">
                            <ShieldCheck size={11} className="text-gold animate-pulse" /> Official Booking Counter
                        </div>

                        <button
                            onClick={() => router.push("/")}
                            className="inline-flex items-center gap-1 text-[10px] uppercase font-sans font-bold tracking-[2px] text-white/70 hover:text-white bg-white/5 hover:bg-red-600 px-3 py-1 rounded-lg border border-white/10 hover:border-red-500/20 transition-all duration-300 cursor-pointer"
                        >
                            Exit Portal <X size={12} />
                        </button>
                    </div>
                    */}

          <div
            className="
                            w-full
                            flex
                            flex-col
                            lg:flex-row
                            flex-1
                            lg:h-[calc(100vh-37px)]
                            lg:max-h-[calc(100vh-37px)]
                            lg:overflow-hidden
                            bg-[#f8f4ed]
                        "
          >
            <BookingFlowLeft place={place} itemVariants={itemVariants} />

            <section
              data-lenis-prevent
              className="
                                w-full
                                lg:w-1/2
                                bg-[#f8f4ed]
                                lg:h-full
                                lg:overflow-y-auto
                                overflow-x-hidden
                                flex
                                flex-col
                                justify-start
                                items-stretch
                                custom-scrollbar
                            "
            >
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="w-full lg:min-h-full flex items-start justify-center p-4 sm:p-6 lg:p-8"
              >
                <BookingFlowRight />
              </motion.div>
            </section>
          </div>
        </motion.div>
      )}
    </>
  );
}
