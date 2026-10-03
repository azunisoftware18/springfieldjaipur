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
  const currentUser = useSelector((state) => state.auth?.user);
  const isLoggedIn = Boolean(currentUser);

  const { placeId, isPlaceLoaded } = usePlace();

  const {
    mutateAsync: createBooking,
    isPending: isSubmitting,
  } = useBookingMutation();

  // ============================================================
  // SCROLL CONTROL
  // ============================================================
  useEffect(() => {
    const rightSection = document.querySelector(".booking-right-scroll");
    if (!rightSection) return;

    const isDesktop = window.innerWidth >= 1024;

    if (isDesktop) {
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
      rightSection.style.overflowY = step === 0 ? "hidden" : "auto";
    } else {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      rightSection.style.overflowY = "";
    }

    const handleResize = () => {
      const isNowDesktop = window.innerWidth >= 1024;
      if (isNowDesktop) {
        document.documentElement.style.overflow = "hidden";
        document.body.style.overflow = "hidden";
        rightSection.style.overflowY = step === 0 ? "hidden" : "auto";
      } else {
        document.documentElement.style.overflow = "";
        document.body.style.overflow = "";
        rightSection.style.overflowY = "";
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      rightSection.style.overflowY = "";
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, [step]);

  // ============================================================
  // FINAL BOOKING
  // ============================================================
  const handleFinalBooking = async (visitorInfo) => {
    try {
      const paymentMethod = isLoggedIn
        ? visitorInfo?.paymentMethod
        : "ONLINE";

      if (!["CASH", "UPI", "ONLINE"].includes(paymentMethod)) {
        throw new Error("Please select a valid payment method");
      }

      if (!isLoggedIn && paymentMethod !== "ONLINE") {
        throw new Error("Guest users can only use online payment");
      }

      if (isLoggedIn && !["CASH", "UPI"].includes(paymentMethod)) {
        throw new Error("Please select Cash or UPI payment");
      }

      if (!placeId) {
        throw new Error("Place information is not available");
      }

      if (!reduxData?.date || !reduxData?.slot?.time) {
        throw new Error("Please select a valid date and slot");
      }

      const tickets = Object.entries(reduxData?.tickets || {})
        .filter(([, quantity]) => Number(quantity) > 0)
        .map(([typeId, quantity]) => ({
          typeId,
          quantity: Number(quantity),
        }));

      if (!tickets.length) {
        throw new Error("Please select at least one ticket");
      }

      const addons = Object.entries(reduxData?.addons || {})
        .filter(([, quantity]) => Number(quantity) > 0)
        .map(([addonId, quantity]) => ({
          addonId,
          quantity: Number(quantity),
        }));

      const slotDateTime = `${reduxData.date}T${reduxData.slot.time}:00.000Z`;

      const totalSeats = tickets.reduce(
        (total, ticket) => total + Number(ticket.quantity),
        0
      );

      const payload = {
        placeId,
        slotDateTime,
        name: visitorInfo?.name,
        email: visitorInfo?.email,
        phone: visitorInfo?.phone,
        paymentMethod,
        bookingType: "TICKET",
        totalAmount: parseFloat(reduxData?.totalAmount || 0),
        totalSeats,
        tickets,
        addons,
      };

      console.log("BOOKING PAYLOAD:", payload);

      const res = await createBooking(payload);

      if (!res?.success) {
        throw new Error(res?.message || "Booking failed");
      }

      const bookingId =
        res?.data?.bookingId || res?.data?.booking?.id || res?.data?.id;

      if (paymentMethod === "CASH") {
        if (!bookingId) {
          throw new Error("Booking ID not received");
        }
        window.location.href = `/payment-success?bookingId=${bookingId}`;
        return;
      }

      if (paymentMethod === "UPI") {
        if (!bookingId) {
          throw new Error("Booking ID not received");
        }
        window.location.href = `/payment-success?bookingId=${bookingId}`;
        return;
      }

      if (paymentMethod === "ONLINE") {
        const paymentData = res?.data?.payment;

        if (!paymentData) {
          throw new Error("Easebuzz payment details not received");
        }

        if (!paymentData?.url) {
          throw new Error("Easebuzz payment URL not received");
        }

        const form = document.createElement("form");
        form.method = "POST";
        form.action = paymentData.url;

        Object.entries(paymentData).forEach(([key, value]) => {
          if (key === "url") return;

          const input = document.createElement("input");
          input.type = "hidden";
          input.name = key;
          input.value = value ?? "";
          form.appendChild(input);
        });

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
    <div
      className="
        booking-right-scroll
        bg-[#f8f4ed]
        relative
        w-full
        lg:h-full
        lg:min-h-0
        lg:border-l
        border-gold/10
        overflow-x-hidden
      "
    >
      <div
        className="
          w-full
          max-w-2xl
          mx-auto
          lg:min-h-full
          px-4
          py-6
          sm:px-6
          sm:py-8
          md:px-8
          md:py-10
          lg:px-12
          xl:px-16
          flex
          flex-col
        "
      >
        {step > 0 && <StepIndicator currentStep={step} />}

        <AnimatePresence mode="wait">
          {step > 0 && !isPlaceLoaded ? (
            <motion.div
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="
                flex
                flex-1
                min-h-[300px]
                items-center
                justify-center
                font-serif
                text-royal-blue/70
              "
            >
              <div className="flex flex-col items-center gap-4">
                <div
                  className="
                    w-10
                    h-10
                    border-4
                    border-gold/20
                    border-t-royal-blue
                    rounded-full
                    animate-spin
                    shadow-sm
                  "
                />
                <p
                  className="
                    text-[10px]
                    sm:text-xs
                    uppercase
                    tracking-[2px]
                    sm:tracking-widest
                    font-bold
                    text-center
                  "
                >
                  Synchronizing Gateway...
                </p>
              </div>
            </motion.div>
          ) : (
            <div className="w-full flex-1 flex flex-col min-h-0">
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

      {isSubmitting && (
        <FullPageLoader message="Generating Secure Ledger..." />
      )}
    </div>
  );
}

// ============================================================
// STEP RENDERER
// ============================================================
function renderStep(step, props) {
  const {
    setStep,
    handleFinalBooking,
    reduxData,
    isSubmitting,
    isLoggedIn,
  } = props;

  switch (step) {
    case 0:
      return <StartStep onNext={() => setStep(1)} />;

    case 1:
      return <DateSelector onNext={() => setStep(2)} />;

    case 2:
      return (
        <TicketCounter
          onNext={() => setStep(3)}
          onBack={() => setStep(1)}
          tickets={reduxData?.tickets || {}}
        />
      );

    case 3:
      return (
        <GuideSelector
          onNext={() => setStep(4)}
          onBack={() => setStep(2)}
          addons={reduxData?.addons || {}}
        />
      );

    case 4:
      return (
        <VisitorForm
          onSubmit={handleFinalBooking}
          onBack={() => setStep(3)}
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
    initial={{ opacity: 0, scale: 0.98, y: 10 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    exit={{ opacity: 0, x: -20 }}
    transition={{ duration: 0.4, ease: "easeOut" }}
    className="
      text-center
      flex
      flex-col
      justify-center
      items-center
      w-full
      max-w-md
      mx-auto
      flex-1
      min-h-[500px]
      sm:min-h-[550px]
      lg:min-h-[600px]
      select-none
      py-8
    "
  >
    <div className="relative mb-8 sm:mb-10">
      <div className="absolute inset-0 bg-gold/10 rounded-full blur-xl scale-150 animate-pulse" />
      <div className="absolute inset-0 border border-gold/15 rounded-full animate-ping opacity-20 scale-110" />

      <div
        className="
          relative
          z-10
          w-28
          h-20
          sm:w-40
          sm:h-24
          md:w-48
          md:h-28
          border-2
          border-gold/40
          flex
          items-center
          justify-center
          shadow-2xl
          rounded-xl
          overflow-hidden
          transition-transform
          duration-300
          hover:scale-105
        "
      >
        <img
          src="/images/logo.jpeg"
          alt="Place Image"
          className="h-full w-full object-cover"
        />
      </div>
    </div>

    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onNext}
      className="
        w-full
        max-w-xs
        bg-gradient-to-r
        from-jaipur-dark
        to-[#994113]
        text-white
        rounded-xl
        font-bold
        font-serif
        text-xs
        sm:text-sm
        tracking-[2px]
        sm:tracking-[3px]
        uppercase
        shadow-[0_10px_25px_rgba(153,65,19,0.3)]
        flex
        items-center
        justify-center
        gap-2
        group
        transition-all
        duration-300
        cursor-pointer
        py-4
        sm:py-5
        px-5
      "
    >
      Book Ticket
      <ArrowRight
        size={18}
        className="group-hover:translate-x-1 transition-transform shrink-0"
      />
    </motion.button>

    <div
      className="
        mt-8
        sm:mt-10
        md:mt-12
        flex
        items-center
        justify-center
        gap-1.5
        text-[8px]
        sm:text-[9px]
        uppercase
        tracking-[2px]
        sm:tracking-[3px]
        text-gray-400
        font-bold
        font-sans
        text-center
      "
    >
      <Lock size={10} className="text-gold shrink-0" />
      <span>Authorized State Booking Gateway</span>
    </div>

    <div className="mt-6 sm:mt-8 pt-5 border-t border-gray-200/70 w-full max-w-xs">
      <p
        className="
          text-[9px]
          sm:text-[10px]
          uppercase
          tracking-[2px]
          text-gray-500
          font-bold
          mb-3
        "
      >
        For Enquiries
      </p>

      <div
        className="
          flex
          flex-col
          sm:flex-row
          items-center
          justify-center
          gap-2
          sm:gap-4
        "
      >
        {/* <a
          href="mailto:springfieldschool.events@gmail.com"
          className="
            text-[11px]
            sm:text-xs
            text-jaipur-dark
            font-semibold
            hover:text-[#994113]
            transition-colors
            break-all
          "
        >
          springfieldschool.events@gmail.com
        </a> */} 

        <span className="hidden sm:block text-gray-300">|</span>

        <a
          href="tel:+919999999999"
          className="
            text-[11px]
            sm:text-xs
            text-jaipur-dark
            font-semibold
            hover:text-[#994113]
            transition-colors
            whitespace-nowrap
          "
        >
          +91 90249 24594 <br/> +91 78785 49539
        </a>
      </div>
    </div>
  </motion.div>
);

// ============================================================
// STEP INDICATOR
// ============================================================
const StepIndicator = ({ currentStep }) => {
  const stepLabels = ["Date", "Tickets", "Guides", "Details"];

  return (
    <div className="w-full max-w-md mx-auto shrink-0 mb-6 sm:mb-8 pt-1">
      <div className="flex justify-between items-center gap-2 mb-2">
        {stepLabels.map((label, index) => (
          <span
            key={index}
            className={`
              text-[8px]
              sm:text-[10px]
              md:text-[11px]
              uppercase
              tracking-[1px]
              sm:tracking-widest
              font-bold
              transition-colors
              duration-300
              text-center
              flex-1
              ${currentStep >= index + 1 ? "text-jaipur-dark" : "text-gray-300"}
            `}
          >
            {label}
          </span>
        ))}
      </div>

      <div className="flex justify-between gap-1 sm:gap-1.5">
        {[1, 2, 3, 4].map((s) => (
          <div
            key={s}
            className={`
              h-1
              w-full
              rounded-full
              transition-colors
              duration-500
              ${currentStep >= s ? "bg-jaipur-dark shadow-sm" : "bg-gray-100"}
            `}
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
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="
      absolute
      inset-0
      bg-white/85
      backdrop-blur-sm
      flex
      flex-col
      items-center
      justify-center
      z-50
      px-5
    "
  >
    <div
      className="
        w-10
        h-10
        sm:w-12
        sm:h-12
        border-4
        border-gold/30
        border-t-royal-blue
        rounded-full
        animate-spin
        mb-4
        shadow-lg
      "
    />

    <p
      className="
        font-serif
        font-bold
        text-xs
        sm:text-sm
        tracking-[2px]
        sm:tracking-widest
        text-royal-blue
        uppercase
        animate-pulse
        text-center
      "
    >
      Generating Secure Ledger...
    </p>
  </motion.div>
);