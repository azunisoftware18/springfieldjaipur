"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePlaces } from "@/hooks/usePlace";
import BookNowBtn from "./ui/BookNowBtn";
import { useGetSetting } from "@/lib/queries/useSetting";
const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const { data: places = [] } = usePlaces();
  const firstPlace = places?.[0];
  const bookingLink = firstPlace
    ? `/book-tickets/${firstPlace.id || firstPlace._id}`
    : "#";
  const { data: setting } = useGetSetting();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav
      className={`fixed w-full z-[999] top-0 left-0 transition-all duration-500 border-b backdrop-blur-xl ${scrolled ? "bg-royal-blue/90 shadow-2xl shadow-black/10 border-gold/20 py-2" : "bg-sandstone/90 border-jaipur-dark/10 py-2"}`}
    >
      <div className="max-w-7xl flex items-center justify-between mx-auto px-4 sm:px-6 lg:px-10 h-[60px]">
        <Link href="/" className="flex items-center gap-3 group">
          <img
            src={
              setting?.logo
                ? `${process.env.NEXT_PUBLIC_IMAGE_URL}${setting.logo}`
                : "/logo.png"
            }
            alt="Logo"
            className="w-12 h-12 md:w-14 md:h-14 rounded-full border-2 border-jaipur-pink object-cover shadow-lg shadow-jaipur-pink/20 transition-all duration-500 group-hover:scale-105"
          />

          <p
            className={`font-bold text-lg sm:text-xl leading-tight ${
              scrolled ? "text-white" : "text-royal-blue"
            }`}
          >
            {setting?.companyName || "Jaipur"}

            <br />

            <span className="text-jaipur-pink text-xs uppercase tracking-[3px]">
              Travel
            </span>
          </p>
        </Link>

        <div className="md:order-2">
          <Link href={bookingLink}>
            <BookNowBtn
              title={"Book Now"}
              addClass="bg-gradient-to-r from-jaipur-dark to-[#994113] text-white border-none hover:from-jaipur-dark hover:to-[#b24d18] hover:scale-[1.02] active:scale-[0.98] shadow-[0_10px_25px_rgba(153,65,19,0.3)] transition-all duration-300"
            />
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Header;
