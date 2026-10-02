"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { motion } from "framer-motion";
import "swiper/css";
import PlaceCard from "./PlaceCard";

export default function PlacesSlider({ finalPlaces }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full"
        >
            <Swiper
                modules={[Autoplay]}
                spaceBetween={24}
                loop={true}
                speed={800}
                autoplay={{
                    delay: 2000,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true,
                }}
                breakpoints={{
                    320: { slidesPerView: 1.15, spaceBetween: 16 },
                    640: { slidesPerView: 2, spaceBetween: 20 },
                    1024: { slidesPerView: 3, spaceBetween: 24 },
                }}
                className="w-full"
            >
                {finalPlaces.map((place, index) => (
                    <SwiperSlide key={index} className="py-4">
                        <PlaceCard place={place} />
                    </SwiperSlide>
                ))}
            </Swiper>
        </motion.div>
    );
}