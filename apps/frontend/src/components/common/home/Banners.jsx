"use client";

import { motion } from "framer-motion";

export default function Banners({ url, url2, text, reverse = false }) {
  return (
    <section className="w-full py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 md:px-12 lg:px-20 overflow-hidden select-none bg-white">
      <div className={`flex flex-col ${reverse ? "md:flex-row-reverse" : "md:flex-row"} items-center justify-between gap-12 md:gap-16 lg:gap-20 max-w-7xl mx-auto`}>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          transition={{ staggerChildren: 0.15 }}
          className="relative w-full max-w-md md:max-w-none md:w-1/2 aspect-[4/3] sm:aspect-video md:aspect-[4/3] flex-shrink-0"
        >
          <motion.div
            variants={{
              hidden: { opacity: 0, x: reverse ? 30 : -30, y: 20 },
              visible: { opacity: 1, x: 0, y: 0, transition: { type: "spring", stiffness: 80, damping: 15 } }
            }}
            className="absolute left-0 bottom-0 z-10 w-[65%] h-[75%] shadow-2xl floatUpDown"
          >
            <img
              src={url}
              alt="Banner Heritage Showcase"
              className="w-full h-full object-cover border-4 md:border-8 border-white rounded-xl sm:rounded-2xl"
            />
          </motion.div>
          <motion.div
            variants={{
              hidden: { opacity: 0, scale: 0.92, y: -20 },
              visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 80, damping: 12, delay: 0.1 } }
            }}
            className="absolute right-0 top-0 z-20 w-[65%] h-[75%] shadow-2xl floatUpDown2"
          >
            <img
              src={url2}
              alt="Banner Detail Frame"
              className="w-full h-full object-cover border-4 md:border-8 border-white rounded-xl sm:rounded-2xl"
            />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: reverse ? -30 : 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full md:w-1/2 text-left"
        >
          <div className="flex items-stretch gap-4 md:gap-6 max-w-2xl mx-auto md:mx-0">
            <motion.div
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, delay: 0.5 }}
              className="w-1.5 sm:w-2 bg-[#E07A5F] rounded-full shrink-0 origin-top"
            />

            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl leading-relaxed md:leading-loose font-serif text-[#1A365D] tracking-wide py-1">
              {text}
            </p>
          </div>
        </motion.div>

      </div>
    </section>
  );
}