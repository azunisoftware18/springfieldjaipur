"use client";

import React from "react";

import { useSelector } from "react-redux";

import StatCard from "@/components/common/StatCard";
import VisitorChart from "@/components/common/VisitorChart";

import { useTickets } from "@/lib/queries/useTickets";
import { useBookings } from "@/lib/queries/useBooking";
import { useSlots } from "@/lib/queries/useSlot";

export default function Page() {

  // =====================
  // PLACE
  // =====================

  const currentPlace = useSelector(
    (state) => state.place.currentPlace
  );

  const placeId = currentPlace?.id;

  const date = new Date()
    .toISOString()
    .split("T")[0];

  // =====================
  // APIs
  // =====================

  const {
    data: tickets,
  } = useTickets();

  const {
    data: bookings,
  } = useBookings();

  const {
    data: slots,
  } = useSlots({
    placeId,
    date,
  });

  // =====================
  // TOTAL REVENUE
  // =====================

  const totalRevenue =
  bookings?.reduce((sum, booking) => {
    if (
      booking.status === "PAID" ||
      booking.paymentStatus === "PAID"
    ) {
      return sum + Number(booking.totalAmount || 0);
    }
    return sum;
  }, 0) || 0;

  // =====================
  // TOTAL BOOKINGS
  // =====================

  const totalBookings =
  bookings?.filter(
    (booking) =>
      booking.status === "PAID" ||
      booking.paymentStatus === "PAID"
  ).length || 0;

  // =====================
  // PENDING BOOKINGS
  // =====================

  const pendingBookings =
    bookings?.filter(
      (booking) =>
        booking.status === "PENDING"
    ).length || 0;

  // =====================
  // TOTAL SLOTS
  // =====================

  const totalSlots =
    slots?.length || 0;

  return (
    <div
      style={{
        backgroundColor: "var(--background)",
      }}
      className="p-8 space-y-8 min-h-screen w-full"
    >

      {/* ===================== */}
      {/* PAGE HEADER */}
      {/* ===================== */}

      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Dashboard Overview
        </h1>

        <p className="text-slate-500 font-medium mt-1">
          Monitor bookings, visitors, revenue and slots.
        </p>
      </div>

      {/* ===================== */}
      {/* STAT CARDS */}
      {/* ===================== */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

        <StatCard
          title="Total Revenue"
          value={`₹${totalRevenue}`}
          percentage={12}
          isUp={true}
          trendingText="Revenue generated"
          subText="From all ticket bookings"
        />

        <StatCard
          title="Total Bookings"
          value={totalBookings}
          percentage={8}
          isUp={true}
          trendingText="Booking activity"
          subText="Total booking records"
        />

        <StatCard
          title="Pending Bookings"
          value={pendingBookings}
          percentage={5}
          isUp={false}
          trendingText="Awaiting confirmation"
          subText="Pending booking requests"
        />

        <StatCard
          title="Total Slots"
          value={totalSlots}
          percentage={4}
          isUp={true}
          trendingText="Available slot capacity"
          subText="Configured booking slots"
        />
      </div>

      {/* ===================== */}
      {/* VISITOR CHART */}
      {/* ===================== */}

      <VisitorChart
        tickets={tickets || []}
      />
    </div>
  );
}