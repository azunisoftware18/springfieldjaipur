// "use client";
// import React from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { useDispatch, useSelector } from "react-redux";
// import { usePlace } from "@/hooks/useCurrentPlace";
// import { setDate, setSlot } from "@/store/slices/bookingSlice";
// import SlotCard from "./SlotCard";
// import FullPageLoader from "@/components/ui/FullPageLoader"; 
// import { useSlots } from "@/hooks/useSlot";

// export default function DateSelector({ onNext }) {
//     const dispatch = useDispatch();
//     const { placeId } = usePlace();
//     const today = new Date().toISOString().split("T")[0];
//     const selectedDate = useSelector((state) => state.booking.date);
//     const selectedSlot = useSelector((state) => state.booking.slot);

//     const { data: slots = [], isLoading } = useSlots({
//         placeId,
//         date: selectedDate
//     });

//     const handleDateChange = (e) => {
//         const newDate = e.target.value;
//         dispatch(setDate(newDate));
//         dispatch(setSlot(null));
//     };

//    const processSlotsWithTimeCheck = () => {
//     if (!slots?.length) return [];

//     const sortedSlots = [...slots].sort((a, b) =>
//         a.time.localeCompare(b.time)
//     );

//     const isTodaySelected = selectedDate === today;

//     return sortedSlots.map((slot) => {
//         let uiStatus = slot.status;

//         if (isTodaySelected) {
//             const now = new Date();

//             const [h, m] = slot.time.split(":").map(Number);

//             const slotTime = new Date();
//             slotTime.setHours(h, m, 0, 0);

//             // Sirf past slots ko expired banao
//             if (slotTime <= now) {
//                 uiStatus = "expired";
//             }
//         }

//         return {
//             ...slot,
//             uiStatus,
//             isAvailable: uiStatus === "available",
//         };
//     });
// };

//     const validatedSlots = processSlotsWithTimeCheck();

//     if (!placeId) {
//         return (
//             <div className="py-14 text-center font-serif text-jaipur-dark/60 animate-pulse tracking-widest text-xs">
//                 ALIGNING CONCIERGE...
//             </div>
//         );
//     }

//     return (
//         <> 
//             <AnimatePresence mode="wait">
//                 {isLoading && <FullPageLoader message="Fetching Imperial Hours..." />}
//             </AnimatePresence>

//             <motion.div
//                 initial={{ opacity: 0, y: 10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: -10 }}
//                 className="w-full h-full flex flex-col justify-start space-y-2 flex-1 relative"  >
//                 <div className="space-y-4 shrink-0">
//                     <div className="relative">
//                         <h2 className="text-xl sm:text-2xl font-serif font-bold text-royal-blue leading-tight">
//                             Plan Your Visit
//                         </h2>
//                         <div className="h-[1px] w-12 bg-gold/40" />
//                     </div>

//                     <input
//                         type="date"
//                         min={today}
//                         value={selectedDate || ""}
//                         onChange={handleDateChange}
//                         className="w-full p-3.5 border border-gold/20 rounded-xl outline-none font-serif text-royal-blue bg-sandstone/10 focus:border-gold/50 focus:bg-white transition-all text-xs font-medium cursor-pointer shadow-inner mt-1"
//                     />
//                 </div>
//                 <div className="w-full flex-1 flex flex-col">
//                     <div className="w-full rounded-xl border border-dashed border-gold/15 p-3 bg-sandstone/5">
//                         {!isLoading && validatedSlots.length === 0 ? (
//                             <div className="py-12 text-center text-jaipur-dark/50 font-serif italic text-xs tracking-wider">
//                                 No active passes available for this date.
//                             </div>
//                         ) : (
//                             <SlotCard
//                                 slots={validatedSlots}
//                                 selectedSlot={selectedSlot}
//                                 onSelect={(slot) => {
//                                     if (slot.isAvailable) {
//                                         dispatch(setSlot(slot));
//                                     }
//                                 }}
//                             />
//                         )}
//                     </div>
//                 </div>

//                 <div className="pt-2 shrink-0 w-full mt-6">
//                     <motion.button
//                         whileHover={selectedSlot ? { scale: 1.01 } : {}}
//                         whileTap={selectedSlot ? { scale: 0.99 } : {}}
//                         disabled={!selectedSlot}
//                         onClick={onNext}
//                         className={`w-full py-4 px-3 rounded-xl font-serif text-xs font-bold tracking-[3px] transition-all duration-300 uppercase border block mb-5
//                             ${!selectedSlot
//                                 ? "bg-sandstone/40 text-gray-400 cursor-not-allowed border-gray-200/50"
//                                 : "bg-gradient-to-r from-jaipur-dark to-[#994113] text-white border-gold/30 cursor-pointer shadow-md shadow-jaipur-dark/5"
//                             }`}
//                     >
//                         {selectedSlot ? `Confirm ${selectedSlot.displayTime || selectedSlot.time} Entry ⟶` : "SELECT TIMING AT GATE"}
//                     </motion.button>
//                 </div>
//             </motion.div>
//         </>
//     );
// }


"use client";

import React, { useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { usePlace } from "@/hooks/useCurrentPlace";
import { setDate, setSlot } from "@/store/slices/bookingSlice";
import SlotCard from "./SlotCard";
import FullPageLoader from "@/components/ui/FullPageLoader";
import { useSlots } from "@/hooks/useSlot";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function DateSelector({ onNext }) {
    const dispatch = useDispatch();
    const { placeId } = usePlace();

    // 1. Calculate default date (16th of current month)
    const defaultDate = useMemo(() => {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        return `${year}-${month}-16`;
    }, []);

    const today = new Date().toISOString().split("T")[0];
    const selectedDate = useSelector((state) => state.booking.date);
    const selectedSlot = useSelector((state) => state.booking.slot);

    // 2. Set default date on mount if no date is selected OR if current date is selected
    useEffect(() => {
        // Agar Redux mein koi date nahi hai, ya current date hai, toh 16th set karo
        if (!selectedDate || selectedDate === today) {
            dispatch(setDate(defaultDate));
            dispatch(setSlot(null));
        }
    }, [selectedDate, defaultDate, today, dispatch]);

    const { data: slots = [], isLoading } = useSlots({
        placeId,
        date: selectedDate,
    });

    const handleDateChange = (date) => {
        if (!date) {
            dispatch(setDate(null));
            dispatch(setSlot(null));
            return;
        }
        const formattedDate = date.toISOString().split("T")[0];
        dispatch(setDate(formattedDate));
        dispatch(setSlot(null));
    };

    const isDateAllowed = (date) => {
        const day = date.getDate();
        return day === 16 || day === 17;
    };

    const processSlotsWithTimeCheck = () => {
        if (!slots || !Array.isArray(slots) || slots.length === 0) return [];

        const sortedSlots = [...slots].sort((a, b) =>
            a.time.localeCompare(b.time)
        );

        const isTodaySelected = selectedDate === today;

        return sortedSlots.map((slot) => {
            let uiStatus = slot.status;

            if (isTodaySelected) {
                const now = new Date();
                const [h, m] = slot.time.split(":").map(Number);

                const slotTime = new Date();
                slotTime.setHours(h, m, 0, 0);

                if (slotTime <= now) {
                    uiStatus = "expired";
                }
            }

            return {
                ...slot,
                uiStatus,
                isAvailable: uiStatus === "available",
            };
        });
    };

    const validatedSlots = processSlotsWithTimeCheck() || [];

    if (!placeId) {
        return (
            <div className="py-14 text-center font-serif text-jaipur-dark/60 animate-pulse tracking-widest text-xs">
                ALIGNING CONCIERGE...
            </div>
        );
    }

    return (
        <>
            <AnimatePresence mode="wait">
                {isLoading && <FullPageLoader message="Fetching Imperial Hours..." />}
            </AnimatePresence>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="w-full h-full flex flex-col justify-start space-y-2 flex-1 relative"
            >
                <div className="space-y-4 shrink-0">
                    <div className="relative">
                        <h2 className="text-xl sm:text-2xl font-serif font-bold text-royal-blue leading-tight">
                            Plan Your Visit
                        </h2>
                        <div className="h-[1px] w-12 bg-gold/40" />
                    </div>

                    <div className="relative mt-1">
                        <DatePicker
                            selected={selectedDate ? new Date(selectedDate) : null}
                            onChange={handleDateChange}
                            filterDate={isDateAllowed}
                            minDate={new Date()}
                            placeholderText="Select date (16th or 17th)"
                            className="w-full p-3.5 border border-gold/20 rounded-xl outline-none font-serif text-royal-blue bg-sandstone/10 focus:border-gold/50 focus:bg-white transition-all text-xs font-medium cursor-pointer shadow-inner"
                            wrapperClassName="w-full"
                        />
                    </div>
                </div>

                <div className="w-full flex-1 flex flex-col">
                    <div className="w-full rounded-xl border border-dashed border-gold/15 p-3 bg-sandstone/5">
                        {!isLoading && validatedSlots.length === 0 ? (
                            <div className="py-12 text-center text-jaipur-dark/50 font-serif italic text-xs tracking-wider">
                                No active passes available for this date.
                            </div>
                        ) : (
                            <SlotCard
                                slots={validatedSlots}
                                selectedSlot={selectedSlot}
                                onSelect={(slot) => {
                                    if (slot.isAvailable) {
                                        dispatch(setSlot(slot));
                                    }
                                }}
                            />
                        )}
                    </div>
                </div>

                <div className="pt-2 shrink-0 w-full mt-6">
                    <motion.button
                        whileHover={selectedSlot ? { scale: 1.01 } : {}}
                        whileTap={selectedSlot ? { scale: 0.99 } : {}}
                        disabled={!selectedSlot}
                        onClick={onNext}
                        className={`w-full py-4 px-3 rounded-xl font-serif text-xs font-bold tracking-[3px] transition-all duration-300 uppercase border block mb-5
                            ${
                                !selectedSlot
                                    ? "bg-sandstone/40 text-gray-400 cursor-not-allowed border-gray-200/50"
                                    : "bg-gradient-to-r from-jaipur-dark to-[#994113] text-white border-gold/30 cursor-pointer shadow-md shadow-jaipur-dark/5"
                            }`}
                    >
                        {selectedSlot
                            ? `Confirm ${selectedSlot.displayTime || selectedSlot.time} Entry ⟶`
                            : "SELECT TIMING AT GATE"}
                    </motion.button>
                </div>
            </motion.div>
        </>
    );
}