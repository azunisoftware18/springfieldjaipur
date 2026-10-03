// "use client";

// import React, { useState, useEffect } from "react";
// import { useSelector } from "react-redux";
// import { motion, AnimatePresence } from "framer-motion";
// import { usePlace } from "@/hooks/useCurrentPlace";
// import { useBookingMutation } from "@/hooks/useBookingMutation";
// import DateSelector from "./bookingParts/DateSelector";
// import TicketCounter from "./bookingParts/TicketCounter";
// import GuideSelector from "./bookingParts/GuideSelector";
// import VisitorForm from "./bookingParts/VisitorForm";
// import { ArrowRight, Lock, Castle } from "lucide-react";
// import FullPageLoader from "@/components/ui/FullPageLoader";

// export default function BookingFlowRight() {
//   const [step, setStep] = useState(0);
//   const reduxData = useSelector((state) => state.booking);
//   const { placeId, isPlaceLoaded } = usePlace();

//   useEffect(() => {
//     const rightSection = document.querySelector(".overflow-y-auto");
//     if (step === 0) {
//       if (rightSection) rightSection.style.overflowY = "hidden";
//       document.documentElement.style.overflow = "hidden";
//       document.body.style.overflow = "hidden";
//     } else {
//       if (rightSection) rightSection.style.overflowY = "auto";
//       document.documentElement.style.overflow = "hidden";
//       document.body.style.overflow = "hidden";
//     }
//     return () => {
//       if (rightSection) rightSection.style.overflowY = "auto";
//       document.documentElement.style.overflow = "";
//       document.body.style.overflow = "";
//     };
//   }, [step]);

//   const { mutate: createBooking, isPending: isSubmitting } =
//     useBookingMutation();

//   // const handleFinalBooking = (visitorInfo) => {
//   //     const payload = {
//   //         placeId,
//   //         slotDateTime: `${reduxData.date}T${reduxData.slot?.time}:00.000Z`,
//   //         ...visitorInfo,
//   //         totalAmount: parseFloat(reduxData.totalAmount),
//   //         totalSeats: Object.values(reduxData.tickets).reduce((a, b) => a + b, 0),
//   //         tickets: Object.entries(reduxData.tickets)
//   //             .filter(([_, qty]) => qty > 0)
//   //             .map(([id, qty]) => ({ typeId: id, quantity: qty })),
//   //         addons: Object.keys(reduxData.addons).filter((id) => reduxData.addons[id] > 0),
//   //     };

//   //     createBooking(payload, {
//   //         onSuccess: (res) => {
//   //             if (res.success && res.data.payment) {
//   //                 const paymentData = res.data.payment;
//   //                 const form = document.createElement("form");
//   //                 form.method = "POST";
//   //                 form.action = paymentData.url;

//   //                 Object.keys(paymentData).forEach((key) => {
//   //                     if (key !== "url") {
//   //                         const input = document.createElement("input");
//   //                         input.type = "hidden";
//   //                         input.name = key;
//   //                         input.value = paymentData[key];
//   //                         form.appendChild(input);
//   //                     }
//   //                 });
//   //                 document.body.appendChild(form);
//   //                 form.submit();
//   //             }
//   //         },
//   //         onError: (err) => {
//   //             console.error("Booking Error:", err);
//   //             alert("Booking failed. Please check your connection and try again.");
//   //         },
//   //     });
//   // };

//   const handleFinalBooking = async (visitorInfo) => {
//     try {
//       const paymentMethod = visitorInfo.paymentMethod;

//       const payload = {
//         placeId,
//         slotDateTime: `${reduxData.date}T${reduxData.slot?.time}:00.000Z`,

//         visitorInfo: {
//           name: visitorInfo.name,
//           email: visitorInfo.email,
//           phone: visitorInfo.phone,
//         },

//         paymentMethod,

//         totalAmount: parseFloat(reduxData.totalAmount),

//         totalSeats: Object.values(reduxData.tickets).reduce((a, b) => a + b, 0),

//         tickets: Object.entries(reduxData.tickets)
//           .filter(([_, quantity]) => quantity > 0)
//           .map(([typeId, quantity]) => ({
//             typeId,
//             quantity,
//           })),

//         addons: Object.entries(reduxData.addons || {})
//           .filter(([_, qty]) => qty > 0)
//           .map(([addonId, qty]) => ({
//             addonId,
//             quantity: qty,
//           })),
//       };

//       const res = await bookingMutation.mutateAsync(payload);

//       if (!res?.success) {
//         throw new Error(res?.message || "Booking failed");
//       }

//       /*
//        * ============================
//        * CASH PAYMENT
//        * ============================
//        */

//       if (paymentMethod === "CASH") {
//         // No payment gateway

//         window.location.href = `/payment-success?bookingId=${res.data.bookingId || res.data.id}`;

//         return;
//       }

//       /*
//        * ============================
//        * UPI PAYMENT
//        * ============================
//        */

//       if (paymentMethod === "UPI") {
//         if (!res.data?.payment) {
//           throw new Error("Payment gateway details not received");
//         }

//         const form = document.createElement("form");

//         form.method = "POST";
//         form.action = res.data.payment.url;

//         Object.entries(res.data.payment.fields || {}).forEach(
//           ([key, value]) => {
//             const input = document.createElement("input");

//             input.type = "hidden";
//             input.name = key;
//             input.value = value;

//             form.appendChild(input);
//           },
//         );

//         document.body.appendChild(form);

//         form.submit();

//         return;
//       }
//     } catch (error) {
//       console.error("Booking Error:", error);

//       // your existing toast/error handling
//     }
//   };

//   return (
//     <div className="bg-[#f8f4ed] relative w-screen flex flex-col min-h-full h-full lg:border-l border-gold/10">
//       {/* <header className="bg-gradient-to-b from-royal-blue to-[#08203e] text-center relative overflow-hidden shrink-0 border-b-4 border-jaipur-dark shadow-md">
//                 <div className="absolute inset-0 opacity-[0.04] bg-mandala pointer-events-none"></div>
//                 <h2 className="text-white font-serif text-base sm:text-lg tracking-[4px] uppercase relative z-10 font-bold drop-shadow-md mt-4 py-2">
//                     {step === 0 ? "Welcome to Heritage" : "Reservation Status"}
//                 </h2>
//                 <div className="h-[2px] w-12 bg-gold mx-auto mt-1 rounded-full relative z-10" />
//             </header> */}

//       <div className="p-6 sm:p-10 lg:p-16 flex-1 flex flex-col justify-center items-stretch w-full max-w-2xl mx-auto min-h-0">
//         {step > 0 && <StepIndicator currentStep={step} />}

//         <AnimatePresence mode="wait">
//           {step > 0 && !isPlaceLoaded ? (
//             <motion.div
//               key="loader"
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               className="h-full w-full flex items-center justify-center font-serif text-royal-blue/70 min-h-[300px]"
//             >
//               <div className="flex flex-col items-center gap-4">
//                 <div className="w-10 h-10 border-4 border-gold/20 border-t-royal-blue rounded-full animate-spin shadow-sm"></div>
//                 <p className="text-xs uppercase tracking-widest font-bold">
//                   Synchronizing Gateway...
//                 </p>
//               </div>
//             </motion.div>
//           ) : (
//             <div className="w-full h-full flex flex-col justify-between items-stretch flex-1 min-h-0">
//               {renderStep(step, {
//                 setStep,
//                 handleFinalBooking,
//                 reduxData,
//                 isSubmitting,
//               })}
//             </div>
//           )}
//         </AnimatePresence>
//       </div>
//       {/* {isSubmitting && <LoadingOverlay />} */}
//       {isSubmitting && <FullPageLoader message="Generating Secure Ledger..." />}
//     </div>
//   );
// }

// function renderStep(step, props) {
//   const { setStep, handleFinalBooking, reduxData, isSubmitting } = props;
//   switch (step) {
//     case 0:
//       return <StartStep onNext={() => setStep(1)} />;
//     case 1:
//       return <DateSelector onNext={() => setStep(2)} />;
//     case 2:
//       return (
//         <TicketCounter
//           onNext={() => setStep(3)}
//           onBack={() => setStep(1)}
//           tickets={reduxData.tickets}
//         />
//       );
//     case 3:
//       return (
//         <GuideSelector
//           onNext={() => setStep(4)}
//           onBack={() => setStep(2)}
//           addons={reduxData.addons}
//         />
//       );
//     case 4:
//       return (
//         <VisitorForm
//           onSubmit={handleFinalBooking}
//           onBack={() => setStep(3)}
//           loading={isSubmitting}
//         />
//       );
//     default:
//       return null;
//   }
// }

// const StartStep = ({ onNext }) => (
//   <motion.div
//     initial={{ opacity: 0, scale: 0.98, y: 10 }}
//     animate={{ opacity: 1, scale: 1, y: 0 }}
//     exit={{ opacity: 0, x: -20 }}
//     transition={{ duration: 0.4, ease: "easeOut" }}
//     className="text-center h-32  flex flex-col justify-center items-center max-w-md mx-auto w-full min-h-[350px] flex-1 select-none"
//   >
//     <div className="relative mb-6 inline-block mx-auto">
//       <div className="absolute inset-0 bg-gold/10 rounded-full blur-xl scale-150 animate-pulse" />
//       <div className="absolute inset-0 border border-gold/15 rounded-full animate-ping opacity-20 scale-110" />

//       <div className="h-20 w-20 sm:h-24 sm:w-52   scale-125   border-2 border-gold/40 flex items-center justify-center shadow-2xl relative z-10 transition-transform duration-300 hover:scale-105">
//         {/* <Castle size={40} className="text-gold stroke-[1.5] drop-shadow-[0_4px_10px_rgba(214,175,55,0.3)]" /> */}
//         <img
//           src="/images/logo.jpeg"
//           alt="Place Image"
//           className="h-full w-full object-cover rounded-xl"
//         />
//       </div>
//     </div>

//     {/* <h3 className="text-2xl sm:text-3xl font-serif text-royal-blue mb-2 font-bold tracking-wide leading-tight">
//             Padharo Mhare Des
//         </h3>
//         <p className="text-jaipur-dark/80 text-xs tracking-wider uppercase font-sans font-medium mb-10">
//             Unlock The Timeless Royalty
//         </p> */}

//     <motion.button
//       whileHover={{ scale: 1.02 }}
//       whileTap={{ scale: 0.98 }}
//       onClick={onNext}
//       className="w-full max-w-xs mx-auto bg-gradient-to-r from-jaipur-dark to-[#994113] text-white rounded-xl font-bold font-serif text-sm tracking-[3px] uppercase shadow-[0_10px_25px_rgba(153,65,19,0.3)] flex items-center justify-center gap-2 group transition-all duration-300 cursor-pointer py-5"
//     >
//       Book Ticket{" "}
//       <ArrowRight
//         size={18}
//         className="group-hover:translate-x-1 transition-transform"
//       />
//     </motion.button>

//     <div className="mt-12 flex items-center justify-center gap-1.5 text-[9px] uppercase tracking-[3px] text-gray-400 font-bold font-sans">
//       <Lock size={10} className="text-gold" /> Authorized State Booking Gateway
//     </div>
//   </motion.div>
// );

// const StepIndicator = ({ currentStep }) => {
//   const stepLabels = ["Date", "Tickets", "Guides", "Details"];
//   return (
//     <div
//       className="mb-5 max-w-xs mx-auto w-full shrink-0"
//       style={{ marginTop: "-70px" }}
//     >
//       <div className="flex justify-between items-center mb-1">
//         {stepLabels.map((label, index) => (
//           <span
//             key={index}
//             className={`text-[10px] sm:text-[11px] uppercase tracking-widest font-bold transition-colors duration-300 ${currentStep >= index + 1 ? "text-jaipur-dark" : "text-gray-300"}`}
//           >
//             {label}
//           </span>
//         ))}
//       </div>
//       <div className="flex justify-between gap-1.5">
//         {[1, 2, 3, 4].map((s) => (
//           <div
//             key={s}
//             className={`h-1 w-full rounded-full transition-colors duration-500 ${currentStep >= s ? "bg-jaipur-dark shadow-sm" : "bg-gray-100"}`}
//           />
//         ))}
//       </div>
//     </div>
//   );
// };

// const LoadingOverlay = () => (
//   <motion.div
//     initial={{ opacity: 0 }}
//     animate={{ opacity: 1 }}
//     className="absolute inset-0 bg-white/85 backdrop-blur-sm flex flex-col items-center justify-center z-50"
//   >
//     <div className="w-12 h-12 border-4 border-gold/30 border-t-royal-blue rounded-full animate-spin mb-4 shadow-lg" />
//     <p className="font-serif font-bold text-sm tracking-widest text-royal-blue uppercase animate-pulse">
//       Generating Secure Ledger...
//     </p>
//   </motion.div>
// );

"use client";

import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { usePlace } from "@/hooks/useCurrentPlace";
import { useBookingMutation } from "@/hooks/useBookingMutation";
import DateSelector from "./bookingParts/DateSelector";
import TicketCounter from "./bookingParts/TicketCounter";
import GuideSelector from "./bookingParts/GuideSelector";
import VisitorForm from "./bookingParts/VisitorForm";
import { ArrowRight, Lock } from "lucide-react";
import FullPageLoader from "@/components/ui/FullPageLoader";

export default function BookingFlowRight() {
  const [step, setStep] = useState(0);

  const reduxData = useSelector((state) => state.booking);

  //   const currentUser = useSelector((state) => state.auth?.user);
  const currentUser = useSelector((state) => state.auth?.user);
  const isLoggedIn = Boolean(currentUser);

  const { placeId, isPlaceLoaded } = usePlace();

  const { mutateAsync: createBooking, isPending: isSubmitting } =
    useBookingMutation();

  // ============================================================
  // BODY / SECTION SCROLL CONTROL
  // ============================================================

  useEffect(() => {
    const rightSection = document.querySelector(".overflow-y-auto");

    if (step === 0) {
      if (rightSection) {
        rightSection.style.overflowY = "hidden";
      }

      document.documentElement.style.overflow = "hidden";

      document.body.style.overflow = "hidden";
    } else {
      if (rightSection) {
        rightSection.style.overflowY = "auto";
      }

      document.documentElement.style.overflow = "hidden";

      document.body.style.overflow = "hidden";
    }

    return () => {
      if (rightSection) {
        rightSection.style.overflowY = "auto";
      }

      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, [step]);

  // ============================================================
  // FINAL BOOKING
  // ============================================================
  const handleFinalBooking = async (visitorInfo) => {
    try {
      // ============================================================
      // DETERMINE PAYMENT METHOD
      // ============================================================

      // Logged-in user:
      // CASH / UPI allowed

      // Guest:
      // ONLINE only

      const paymentMethod = isLoggedIn ? visitorInfo?.paymentMethod : "ONLINE";

      // ============================================================
      // PAYMENT VALIDATION
      // ============================================================

      if (!["CASH", "UPI", "ONLINE"].includes(paymentMethod)) {
        throw new Error("Please select a valid payment method");
      }

      // Guest can ONLY use ONLINE
      if (!isLoggedIn && paymentMethod !== "ONLINE") {
        throw new Error("Guest users can only use online payment");
      }

      // Logged-in user can ONLY use CASH / UPI
      if (isLoggedIn && !["CASH", "UPI"].includes(paymentMethod)) {
        throw new Error("Please select Cash or UPI payment");
      }

      // ============================================================
      // VALIDATE PLACE
      // ============================================================

      if (!placeId) {
        throw new Error("Place information is not available");
      }

      // ============================================================
      // VALIDATE DATE / SLOT
      // ============================================================

      if (!reduxData?.date || !reduxData?.slot?.time) {
        throw new Error("Please select a valid date and slot");
      }

      // ============================================================
      // TICKETS
      // ============================================================

      const tickets = Object.entries(reduxData?.tickets || {})
        .filter(([, quantity]) => Number(quantity) > 0)
        .map(([typeId, quantity]) => ({
          typeId,
          quantity: Number(quantity),
        }));

      if (!tickets.length) {
        throw new Error("Please select at least one ticket");
      }

      // ============================================================
      // ADDONS
      // ============================================================

      const addons = Object.entries(reduxData?.addons || {})
        .filter(([, quantity]) => Number(quantity) > 0)
        .map(([addonId, quantity]) => ({
          addonId,
          quantity: Number(quantity),
        }));

      // ============================================================
      // SLOT DATE TIME
      // ============================================================

      const slotDateTime = `${reduxData.date}T${reduxData.slot.time}:00.000Z`;

      // ============================================================
      // TOTAL SEATS
      // ============================================================

      const totalSeats = tickets.reduce(
        (total, ticket) => total + Number(ticket.quantity),
        0,
      );

      // ============================================================
      // PAYLOAD
      // ============================================================

      const payload = {
        placeId,

        slotDateTime,

        name: visitorInfo.name,

        email: visitorInfo.email,

        phone: visitorInfo.phone,

        paymentMethod,

        bookingType: "TICKET",

        totalAmount: parseFloat(reduxData?.totalAmount || 0),

        totalSeats,

        tickets,

        addons,
      };

      console.log("BOOKING PAYLOAD:", payload);

      // ============================================================
      // CREATE BOOKING
      // ============================================================

      const res = await createBooking(payload);

      // ============================================================
      // RESPONSE VALIDATION
      // ============================================================

      if (!res?.success) {
        throw new Error(res?.message || "Booking failed");
      }

      // ============================================================
      // GET BOOKING DATA
      // ============================================================

      const bookingId =
        res?.data?.bookingId || res?.data?.booking?.id || res?.data?.id;

      // ============================================================
      // CASH
      // ============================================================

      if (paymentMethod === "CASH") {
        if (!bookingId) {
          throw new Error("Booking ID not received");
        }

        // Backend has already:
        // - created booking
        // - marked PAID
        // - generated ticket
        // - generated PDF
        // - uploaded PDF

        window.location.href = `/payment-success?bookingId=${bookingId}`;

        return;
      }

      // ============================================================
      // LOGGED-IN UPI
      // ============================================================

      if (paymentMethod === "UPI") {
        if (!bookingId) {
          throw new Error("Booking ID not received");
        }

        // As per your current backend flow,
        // logged-in UPI is direct booking.
        window.location.href = `/payment-success?bookingId=${bookingId}`;

        return;
      }

      // ============================================================
      // GUEST ONLINE → EASEBUZZ
      // ============================================================

      if (paymentMethod === "ONLINE") {
        const paymentData = res?.data?.payment;

        if (!paymentData) {
          throw new Error("Easebuzz payment details not received");
        }

        if (!paymentData.url) {
          throw new Error("Easebuzz payment URL not received");
        }

        // ----------------------------------------------------------
        // CREATE EASEBUZZ FORM
        // ----------------------------------------------------------

        const form = document.createElement("form");

        form.method = "POST";

        form.action = paymentData.url;

        // ----------------------------------------------------------
        // ADD EASEBUZZ FIELDS
        // ----------------------------------------------------------

        Object.entries(paymentData).forEach(([key, value]) => {
          // URL is form action
          if (key === "url") {
            return;
          }

          const input = document.createElement("input");

          input.type = "hidden";

          input.name = key;

          input.value = value ?? "";

          form.appendChild(input);
        });

        // ----------------------------------------------------------
        // SUBMIT TO EASEBUZZ
        // ----------------------------------------------------------

        document.body.appendChild(form);

        form.submit();

        return;
      }
    } catch (error) {
      console.error("Booking Error:", error);

      alert(error?.message || "Booking failed. Please try again.");
    }
  };

  // ============================================================
  // UI
  // ============================================================

  return (
    <div className="bg-[#f8f4ed] relative w-screen flex flex-col min-h-full h-full lg:border-l border-gold/10">
      <div className="p-6 sm:p-10 lg:p-16 flex-1 flex flex-col justify-center items-stretch w-full max-w-2xl mx-auto min-h-0">
        {/* =====================================================
            STEP INDICATOR
        ====================================================== */}

        {step > 0 && <StepIndicator currentStep={step} />}

        <AnimatePresence mode="wait">
          {/* ===================================================
              PLACE LOADER
          ==================================================== */}

          {step > 0 && !isPlaceLoaded ? (
            <motion.div
              key="loader"
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
              className="h-full w-full flex items-center justify-center font-serif text-royal-blue/70 min-h-[300px]"
            >
              <div className="flex flex-col items-center gap-4">
                <div className="w-10 h-10 border-4 border-gold/20 border-t-royal-blue rounded-full animate-spin shadow-sm" />

                <p className="text-xs uppercase tracking-widest font-bold">
                  Synchronizing Gateway...
                </p>
              </div>
            </motion.div>
          ) : (
            <div className="w-full h-full flex flex-col justify-between items-stretch flex-1 min-h-0">
              {renderStep(step, {
                setStep,
                handleFinalBooking,
                reduxData,
                isSubmitting,
                isLoggedIn,
              })}
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* =======================================================
          SUBMIT LOADER
      ======================================================== */}

      {isSubmitting && (
        <FullPageLoader message={"Generating Secure Ledger..."} />
      )}
    </div>
  );
}

// ============================================================
// STEP RENDERER
// ============================================================

function renderStep(step, props) {
  //   const { setStep, handleFinalBooking, reduxData, isSubmitting } = props;
  const { setStep, handleFinalBooking, reduxData, isSubmitting, isLoggedIn } =
    props;

  switch (step) {
    // --------------------------------------------------------
    // STEP 0
    // --------------------------------------------------------

    case 0:
      return <StartStep onNext={() => setStep(1)} />;

    // --------------------------------------------------------
    // STEP 1
    // --------------------------------------------------------

    case 1:
      return <DateSelector onNext={() => setStep(2)} />;

    // --------------------------------------------------------
    // STEP 2
    // --------------------------------------------------------

    case 2:
      return (
        <TicketCounter
          onNext={() => setStep(3)}
          onBack={() => setStep(1)}
          tickets={reduxData?.tickets || {}}
        />
      );

    // --------------------------------------------------------
    // STEP 3
    // --------------------------------------------------------

    case 3:
      return (
        <GuideSelector
          onNext={() => setStep(4)}
          onBack={() => setStep(2)}
          addons={reduxData?.addons || {}}
        />
      );

    // --------------------------------------------------------
    // STEP 4
    // --------------------------------------------------------

    case 4:
      return (
        <VisitorForm
          onSubmit={handleFinalBooking}
          onBack={() => setStep(3)}
          // loading={loading}
          showCashOption={isLoggedIn}
        />
      );

    default:
      return null;
  }
}

// ============================================================
// START STEP
// ============================================================

const StartStep = ({ onNext }) => (
  <motion.div
    initial={{
      opacity: 0,
      scale: 0.98,
      y: 10,
    }}
    animate={{
      opacity: 1,
      scale: 1,
      y: 0,
    }}
    exit={{
      opacity: 0,
      x: -20,
    }}
    transition={{
      duration: 0.4,
      ease: "easeOut",
    }}
    className="text-center h-32 flex flex-col justify-center items-center max-w-md mx-auto w-full min-h-[350px] flex-1 select-none"
  >
    <div className="relative mb-6 inline-block mx-auto">
      <div className="absolute inset-0 bg-gold/10 rounded-full blur-xl scale-150 animate-pulse" />

      <div className="absolute inset-0 border border-gold/15 rounded-full animate-ping opacity-20 scale-110" />

      <div className="h-20 w-20 sm:h-24 sm:w-52 scale-125 border-2 border-gold/40 flex items-center justify-center shadow-2xl relative z-10 transition-transform duration-300 hover:scale-105">
        <img
          src="/images/logo.jpeg"
          alt="Place Image"
          className="h-full w-full object-cover rounded-xl"
        />
      </div>
    </div>

    <motion.button
      whileHover={{
        scale: 1.02,
      }}
      whileTap={{
        scale: 0.98,
      }}
      onClick={onNext}
      className="w-full max-w-xs mx-auto bg-gradient-to-r from-jaipur-dark to-[#994113] text-white rounded-xl font-bold font-serif text-sm tracking-[3px] uppercase shadow-[0_10px_25px_rgba(153,65,19,0.3)] flex items-center justify-center gap-2 group transition-all duration-300 cursor-pointer py-5"
    >
      Book Ticket{" "}
      <ArrowRight
        size={18}
        className="group-hover:translate-x-1 transition-transform"
      />
    </motion.button>

    <div className="mt-12 flex items-center justify-center gap-1.5 text-[9px] uppercase tracking-[3px] text-gray-400 font-bold font-sans">
      <Lock size={10} className="text-gold" />
      Authorized State Booking Gateway
    </div>
  </motion.div>
);

// ============================================================
// STEP INDICATOR
// ============================================================

const StepIndicator = ({ currentStep }) => {
  const stepLabels = ["Date", "Tickets", "Guides", "Details"];

  return (
    <div
      className="mb-5 max-w-xs mx-auto w-full shrink-0"
      style={{
        marginTop: "-70px",
      }}
    >
      <div className="flex justify-between items-center mb-1">
        {stepLabels.map((label, index) => (
          <span
            key={index}
            className={`text-[10px] sm:text-[11px] uppercase tracking-widest font-bold transition-colors duration-300 ${
              currentStep >= index + 1 ? "text-jaipur-dark" : "text-gray-300"
            }`}
          >
            {label}
          </span>
        ))}
      </div>

      <div className="flex justify-between gap-1.5">
        {[1, 2, 3, 4].map((s) => (
          <div
            key={s}
            className={`h-1 w-full rounded-full transition-colors duration-500 ${
              currentStep >= s ? "bg-jaipur-dark shadow-sm" : "bg-gray-100"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

// ============================================================
// LOADING OVERLAY
// ============================================================

const LoadingOverlay = () => (
  <motion.div
    initial={{
      opacity: 0,
    }}
    animate={{
      opacity: 1,
    }}
    className="absolute inset-0 bg-white/85 backdrop-blur-sm flex flex-col items-center justify-center z-50"
  >
    <div className="w-12 h-12 border-4 border-gold/30 border-t-royal-blue rounded-full animate-spin mb-4 shadow-lg" />

    <p className="font-serif font-bold text-sm tracking-widest text-royal-blue uppercase animate-pulse">
      Generating Secure Ledger...
    </p>
  </motion.div>
);
