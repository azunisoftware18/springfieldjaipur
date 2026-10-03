// "use client";

// import { useState, useMemo } from "react";
// import { useDispatch } from "react-redux";
// import { motion, AnimatePresence } from "framer-motion";
// import { setVisitorInfo } from "@/store/slices/bookingSlice";
// import FullPageLoader from "@/components/ui/FullPageLoader";

// export default function VisitorForm({
//   onSubmit,
//   onBack,
//   loading,
//   showCashOption = false, // Agar true hai → logged in user (Cash option milega)
// }) {
//   const dispatch = useDispatch();

//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     paymentMethod: "",
//   });

//   const [touched, setTouched] = useState({});

//   // =========================================================
//   // VALIDATION
//   // =========================================================
//   const errors = useMemo(() => {
//     const errs = {};

//     if (formData.name.length > 0 && formData.name.length < 3) {
//       errs.name = "Name must be at least 3 characters";
//     }

//     if (formData.email.length > 0 && !/^\S+@\S+\.\S+$/.test(formData.email)) {
//       errs.email = "Invalid email format";
//     }

//     if (formData.phone.length > 0 && formData.phone.length !== 10) {
//       errs.phone = "Phone must be exactly 10 digits";
//     }

//     // 🔥 Payment method validation sirf tab jab wo field show ho rahi ho
//     if (showCashOption && !formData.paymentMethod) {
//       errs.paymentMethod = "Please select a payment method";
//     }

//     return errs;
//   }, [formData, showCashOption]);

//   // =========================================================
//   // FORM VALIDITY
//   // =========================================================
//   const isFormValid =
//     formData.name.length >= 3 &&
//     /^\S+@\S+\.\S+$/.test(formData.email) &&
//     formData.phone.length === 10 &&
//     // 🔥 Payment method required sirf tab jab show ho rahi ho
//     (showCashOption ? formData.paymentMethod !== "" : true);

//   // =========================================================
//   // HANDLE SUBMIT
//   // =========================================================
//   const handleSubmit = (e) => {
//     e.preventDefault();

//     if (isFormValid) {
//       // 🔥 Guest user ke liye default payment method UPI set karo
//       const finalData = {
//         ...formData,
//         paymentMethod: showCashOption ? formData.paymentMethod : "UPI",
//       };

//       dispatch(setVisitorInfo(finalData));
//       onSubmit(finalData);
//     }
//   };

//   // =========================================================
//   // PHONE INPUT HANDLER (Sirf digits allow)
//   // =========================================================
//   const handlePhoneChange = (e) => {
//     const value = e.target.value.replace(/\D/g, "");
//     setFormData({ ...formData, phone: value });
//   };

//   // =========================================================
//   // INPUT CLASS HELPER
//   // =========================================================
//   const inputClasses = (fieldName) =>
//     `w-full p-3.5 border rounded-xl outline-none text-sm font-medium font-serif text-royal-blue transition-all duration-300 placeholder:text-gray-300 placeholder:font-normal bg-sandstone/10 ${
//       touched[fieldName] && errors[fieldName]
//         ? "border-red-400 focus:border-red-500 bg-red-50/20"
//         : "border-gold/20 focus:border-gold/50 focus:bg-white focus:shadow-md focus:shadow-royal-blue/5"
//     }`;

//   // =========================================================
//   // RENDER
//   // =========================================================
//   return (
//     <>
//       <AnimatePresence mode="wait">
//         {loading && <FullPageLoader message="Payment Processing ..." />}
//       </AnimatePresence>

//       <motion.form
//         onSubmit={handleSubmit}
//         initial={{ opacity: 0, y: 12 }}
//         animate={{ opacity: 1, y: 0 }}
//         exit={{ opacity: 0, y: -12 }}
//         className="w-full space-y-5"
//       >
//         {/* ─── HEADER ─── */}
//         <div className="relative">
//           <h2 className="text-2xl sm:text-3xl font-serif font-normal text-royal-blue leading-tight">
//             Enter your personal details
//           </h2>
//           <div className="h-[1px] w-12 bg-gold/40 mt-2" />
//         </div>

//         {/* ─── FORM FIELDS ─── */}
//         <div className="space-y-4">
//           {/* Full Name */}
//           <div className="space-y-1">
//             <label className="text-[9px] font-bold text-royal-blue/60 uppercase tracking-[2px] block ml-1">
//               Full Name
//             </label>
//             <input
//               required
//               value={formData.name}
//               onBlur={() => setTouched({ ...touched, name: true })}
//               className={inputClasses("name")}
//               placeholder="Your Name"
//               onChange={(e) =>
//                 setFormData({ ...formData, name: e.target.value })
//               }
//             />
//             {touched.name && errors.name && (
//               <p className="text-[10px] text-red-500 font-bold ml-1 tracking-wide">
//                 ✦ {errors.name}
//               </p>
//             )}
//           </div>

//           {/* Email */}
//           <div className="space-y-1">
//             <label className="text-[9px] font-bold text-royal-blue/60 uppercase tracking-[2px] block ml-1">
//               Email Address
//             </label>
//             <input
//               required
//               type="email"
//               value={formData.email}
//               onBlur={() => setTouched({ ...touched, email: true })}
//               className={inputClasses("email")}
//               placeholder="Email Address"
//               onChange={(e) =>
//                 setFormData({ ...formData, email: e.target.value })
//               }
//             />
//             {touched.email && errors.email && (
//               <p className="text-[10px] text-red-500 font-bold ml-1 tracking-wide">
//                 ✦ {errors.email}
//               </p>
//             )}
//           </div>

//           {/* Mobile Number */}
//           <div className="space-y-1">
//             <label className="text-[9px] font-bold text-royal-blue/60 uppercase tracking-[2px] block ml-1">
//               Mobile Number
//             </label>
//             <div className="relative">
//               <span className="absolute left-4 top-1/2 -translate-y-1/2 text-royal-blue/40 font-bold border-r pr-3 border-gold/20 text-xs font-sans">
//                 +91
//               </span>
//               <input
//                 required
//                 type="tel"
//                 maxLength={10}
//                 value={formData.phone}
//                 onBlur={() => setTouched({ ...touched, phone: true })}
//                 className={`${inputClasses("phone")} pl-14 font-sans`}
//                 placeholder="Phone number"
//                 onChange={handlePhoneChange}
//               />
//             </div>
//             {touched.phone && errors.phone && (
//               <p className="text-[10px] text-red-500 font-bold ml-1 tracking-wide">
//                 ✦ {errors.phone}
//               </p>
//             )}
//           </div>

//           {/* 🔥 Payment Method — Sirf logged-in user ke liye (showCashOption true hone par) */}
//           {showCashOption && (
//             <div className="space-y-1">
//               <label className="text-[9px] font-bold text-royal-blue/60 uppercase tracking-[2px] block ml-1">
//                 Payment Method
//               </label>
//               <div className="relative">
//                 <select
//                   required
//                   value={formData.paymentMethod}
//                   onChange={(e) =>
//                     setFormData({ ...formData, paymentMethod: e.target.value })
//                   }
//                   onBlur={() => setTouched({ ...touched, paymentMethod: true })}
//                   className={`${inputClasses(
//                     "paymentMethod",
//                   )} appearance-none cursor-pointer pr-10`}
//                 >
//                   <option value="" disabled>
//                     Select Payment Method
//                   </option>
//                   <option value="CASH">Cash</option>
//                   <option value="UPI">UPI</option>
//                 </select>

//                 {/* Dropdown Arrow */}
//                 <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-royal-blue/50 text-sm">
//                   ▼
//                 </span>
//               </div>
//               {touched.paymentMethod && errors.paymentMethod && (
//                 <p className="text-[10px] text-red-500 font-bold ml-1 tracking-wide">
//                   ✦ {errors.paymentMethod}
//                 </p>
//               )}
//             </div>
//           )}
//         </div>

//         {/* ─── EMAIL INFO BOX ─── */}
//         <div className="bg-sandstone/60 p-4 rounded-xl border border-gold/15 flex gap-3 items-center select-none">
//           <span className="text-xl filter drop-shadow-sm">📧</span>
//           <p className="text-[11px] text-royal-blue/70 leading-relaxed font-serif italic">
//             Your e-ticket and transaction details will be sent to this email
//             address. Please double check.
//           </p>
//         </div>

//         {/* ─── BUTTONS ─── */}
//         <div className="flex justify-between items-center pt-2 gap-4">
//           <button
//             type="button"
//             onClick={onBack}
//             className="flex-1 py-3.5 font-bold font-serif text-xs text-jaipur-dark hover:text-royal-blue transition-colors uppercase tracking-[2px]"
//           >
//             ← Edit ticket
//           </button>

//           <button
//             type="submit"
//             disabled={loading || !isFormValid}
//             className={`flex-[2] py-3.5 rounded-xl font-serif text-xs font-bold tracking-[3px] transition-all duration-300 uppercase border relative overflow-hidden ${
//               loading || !isFormValid
//                 ? "bg-sandstone/50 text-gray-400 cursor-not-allowed border-gray-200/60"
//                 : "bg-gradient-to-r from-jaipur-dark to-[#994113] text-white border-gold/30 cursor-pointer shadow-md shadow-jaipur-dark/10 active:scale-99"
//             }`}
//           >
//             <span>PROCEED TO PAY ⟶</span>
//           </button>
//         </div>
//       </motion.form>
//     </>
//   );
// }

"use client";

import { useState, useMemo } from "react";
import { useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { setVisitorInfo } from "@/store/slices/bookingSlice";
import FullPageLoader from "@/components/ui/FullPageLoader";

export default function VisitorForm({
  onSubmit,
  onBack,
  loading,
  showCashOption = false, // Agar true hai → logged in user (Cash + UPI dono options)
}) {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    paymentMethod: showCashOption ? "" : "ONLINE",
  });

  const [touched, setTouched] = useState({});

  // =========================================================
  // VALIDATION
  // =========================================================
  const errors = useMemo(() => {
    const errs = {};

    if (formData.name.length > 0 && formData.name.length < 3) {
      errs.name = "Name must be at least 3 characters";
    }

    if (formData.email.length > 0 && !/^\S+@\S+\.\S+$/.test(formData.email)) {
      errs.email = "Invalid email format";
    }

    if (formData.phone.length > 0 && formData.phone.length !== 10) {
      errs.phone = "Phone must be exactly 10 digits";
    }

    // 🔥 Payment method validation sirf logged-in user ke liye
    if (showCashOption && !formData.paymentMethod) {
      errs.paymentMethod = "Please select a payment method";
    }

    return errs;
  }, [formData, showCashOption]);

  // =========================================================
  // FORM VALIDITY
  // =========================================================
  const isFormValid =
    formData.name.length >= 3 &&
    /^\S+@\S+\.\S+$/.test(formData.email) &&
    formData.phone.length === 10 &&
    (showCashOption
      ? formData.paymentMethod !== ""
      : formData.paymentMethod === "ONLINE");

  // =========================================================
  // HANDLE SUBMIT
  // =========================================================
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isFormValid) return;

    const finalData = {
      ...formData,

      // Logged-in → selected CASH/UPI
      // Guest → force ONLINE
      paymentMethod: showCashOption ? formData.paymentMethod : "ONLINE",
    };

    dispatch(setVisitorInfo(finalData));
    onSubmit(finalData);
  };

  // =========================================================
  // PHONE INPUT HANDLER (Sirf digits allow)
  // =========================================================
  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    setFormData({ ...formData, phone: value });
  };

  // =========================================================
  // INPUT CLASS HELPER
  // =========================================================
  const inputClasses = (fieldName) =>
    `w-full p-3.5 border rounded-xl outline-none text-sm font-medium font-serif text-royal-blue transition-all duration-300 placeholder:text-gray-300 placeholder:font-normal bg-sandstone/10 ${
      touched[fieldName] && errors[fieldName]
        ? "border-red-400 focus:border-red-500 bg-red-50/20"
        : "border-gold/20 focus:border-gold/50 focus:bg-white focus:shadow-md focus:shadow-royal-blue/5"
    }`;

  // =========================================================
  // RENDER
  // =========================================================
  return (
    <>
      <AnimatePresence mode="wait">
        {loading && <FullPageLoader message="Generating your ticket..." />}
      </AnimatePresence>

      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        className="w-full space-y-5"
      >
        {/* ─── HEADER ─── */}
        <div className="relative">
          <h2 className="text-2xl sm:text-3xl font-serif font-normal text-royal-blue leading-tight">
            Enter your personal details
          </h2>
          <div className="h-[1px] w-12 bg-gold/40 mt-2" />
        </div>

        {/* ─── FORM FIELDS ─── */}
        <div className="space-y-4">
          {/* Full Name */}
          <div className="space-y-1">
            <label className="text-[9px] font-bold text-royal-blue/60 uppercase tracking-[2px] block ml-1">
              Full Name
            </label>
            <input
              required
              value={formData.name}
              onBlur={() => setTouched({ ...touched, name: true })}
              className={inputClasses("name")}
              placeholder="Your Name"
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
            {touched.name && errors.name && (
              <p className="text-[10px] text-red-500 font-bold ml-1 tracking-wide">
                ✦ {errors.name}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label className="text-[9px] font-bold text-royal-blue/60 uppercase tracking-[2px] block ml-1">
              Email Address
            </label>
            <input
              required
              type="email"
              value={formData.email}
              onBlur={() => setTouched({ ...touched, email: true })}
              className={inputClasses("email")}
              placeholder="Email Address"
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
            {touched.email && errors.email && (
              <p className="text-[10px] text-red-500 font-bold ml-1 tracking-wide">
                ✦ {errors.email}
              </p>
            )}
          </div>

          {/* Mobile Number */}
          <div className="space-y-1">
            <label className="text-[9px] font-bold text-royal-blue/60 uppercase tracking-[2px] block ml-1">
              Mobile Number
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-royal-blue/40 font-bold border-r pr-3 border-gold/20 text-xs font-sans">
                +91
              </span>
              <input
                required
                type="tel"
                maxLength={10}
                value={formData.phone}
                onBlur={() => setTouched({ ...touched, phone: true })}
                className={`${inputClasses("phone")} pl-14 font-sans`}
                placeholder="Phone number"
                onChange={handlePhoneChange}
              />
            </div>
            {touched.phone && errors.phone && (
              <p className="text-[10px] text-red-500 font-bold ml-1 tracking-wide">
                ✦ {errors.phone}
              </p>
            )}
          </div>

          {/* 🔥 Payment Method — Sirf logged-in user ke liye (showCashOption true hone par) */}
          {showCashOption && (
            <div className="space-y-1">
              <label className="text-[9px] font-bold text-royal-blue/60 uppercase tracking-[2px] block ml-1">
                Payment Method
              </label>
              <div className="relative">
                <select
                  required
                  value={formData.paymentMethod}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      paymentMethod: e.target.value,
                    })
                  }
                  onBlur={() =>
                    setTouched({
                      ...touched,
                      paymentMethod: true,
                    })
                  }
                  className={`${inputClasses(
                    "paymentMethod",
                  )} appearance-none cursor-pointer pr-10`}
                >
                  <option value="" disabled>
                    Select Payment Method
                  </option>

                  <option value="CASH">Cash</option>

                  <option value="UPI">UPI</option>
                </select>

                {/* Dropdown Arrow */}
                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-royal-blue/50 text-sm">
                  ▼
                </span>
              </div>
              {touched.paymentMethod && errors.paymentMethod && (
                <p className="text-[10px] text-red-500 font-bold ml-1 tracking-wide">
                  ✦ {errors.paymentMethod}
                </p>
              )}
            </div>
          )}
        </div>

        {/* ─── EMAIL INFO BOX ─── */}
        <div className="bg-sandstone/60 p-4 rounded-xl border border-gold/15 flex gap-3 items-center select-none">
          <span className="text-xl filter drop-shadow-sm">📧</span>
          <p className="text-[11px] text-royal-blue/70 leading-relaxed font-serif italic">
            Your e-ticket and transaction details will be sent to this email
            address. Please double check.
          </p>
        </div>

        {/* ─── BUTTONS ─── */}
        <div className="flex justify-between items-center pt-2 gap-4">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 py-3.5 font-bold font-serif text-xs text-jaipur-dark hover:text-royal-blue transition-colors uppercase tracking-[2px]"
          >
            ← Edit ticket
          </button>

          <button
            type="submit"
            disabled={loading || !isFormValid}
            className={`flex-[2] py-3.5 rounded-xl font-serif text-xs font-bold tracking-[3px] transition-all duration-300 uppercase border relative overflow-hidden ${
              loading || !isFormValid
                ? "bg-sandstone/50 text-gray-400 cursor-not-allowed border-gray-200/60"
                : "bg-gradient-to-r from-jaipur-dark to-[#994113] text-white border-gold/30 cursor-pointer shadow-md shadow-jaipur-dark/10 active:scale-99"
            }`}
          >
            <span>
              {/* 🔥 Button text dynamic: CASH ke liye "GENERATE TICKET", UPI ke liye "PROCEED TO PAY" */}
              {formData.paymentMethod === "ONLINE"
                ? "PROCEED TO PAY ⟶"
                : "GENERATE TICKET ⟶"}
            </span>
          </button>
        </div>
      </motion.form>
    </>
  );
}
