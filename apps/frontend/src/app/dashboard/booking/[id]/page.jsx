"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Download,
  Printer,
  RefreshCw,
  Calendar,
  MapPin,
  Users,
  Ticket,
  CreditCard,
  Phone,
  Mail,
  User,
  Clock,
} from "lucide-react";
import api from "@/lib/api";
import Button from "@/components/ui/Button";

export default function BookingDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [booking, setBooking] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      fetchBookingDetails();
    } else {
      setError("No booking ID provided");
      setIsLoading(false);
    }
  }, [id]);

  const fetchBookingDetails = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await api.get(`/booking/${id}`);

      setBooking(res.data.data);
    } catch (err) {
      console.error("Fetch error:", err);

      setError(err?.response?.data?.message || "Booking not found");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-slate-50 to-slate-100 p-4">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm max-w-md w-full p-8">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">
              Booking Not Found
            </h2>
            <p className="text-slate-600 mb-6">
              {error || "The booking you are looking for does not exist."}
            </p>

            <div className="space-y-3">
              <button
                onClick={() => router.back()}
                className="w-full px-4 py-2 bg-slate-600 text-black rounded-lg hover:bg-slate-700 transition-colors"
              >
                Go Back
              </button>

              <button
                onClick={fetchBookingDetails}
                className="w-full px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 px-4 py-2  rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Bookings
          </button>

          <div className="flex gap-3">
            {/* <button
              onClick={() => window.print()}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-all"
            >
              <Printer className="w-4 h-4" />
              Print
            </button> */}
            <Button
              text="Download Ticket"
              icon={Download}
              iconPosition="left"
              onClick={() => {
                window.open(
                  `${process.env.NEXT_PUBLIC_API_URL}/ticket/download/${booking.id}`,
                  "_blank"
                );
              }}
              className="border border-slate-200 rounded-lg text-slate-600"
            />

            {/* <button
              onClick={fetchBookingDetails}
              className="flex items-center gap-2 px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button> */}
          </div>
        </div>

        {/* Booking Header Card */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm mb-6">
          <div className="p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 break-all">
                  Booking #{id || "N/A"}
                </h1>
                <div className="flex items-center gap-2 mt-1 text-slate-500">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {booking.createdAt
                      ? new Date(booking.createdAt).toLocaleString("en-IN")
                      : "N/A"}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="px-3 py-1 bg-slate-50 text-slate-700 rounded-full text-sm font-medium border border-slate-100">
                  {booking.bookingType || "TICKET"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Information */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="border-b border-slate-100 px-6 py-4">
                <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                  <User className="w-5 h-5 text-slate-600" />
                  Customer Information
                </h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Full Name
                    </label>
                    <p className="text-slate-900 font-medium mt-1">
                      {booking.name || "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Phone Number
                    </label>
                    <p className="text-slate-900 font-medium mt-1 flex items-center gap-2">
                      <Phone className="w-4 h-4 text-slate-400" />
                      {booking.phone || "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Email Address
                    </label>
                    <p className="text-slate-900 font-medium mt-1 flex items-center gap-2">
                      <Mail className="w-4 h-4 text-slate-400" />
                      {booking.email || "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Place
                    </label>
                    <p className="text-slate-900 font-medium mt-1 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      {booking.place?.name || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Details */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="border-b border-slate-100 px-6 py-4">
                <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                  <Ticket className="w-5 h-5 text-slate-600" />
                  Booking Details
                </h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Slot Date & Time
                    </label>
                    <div className="mt-1">
                      {booking.slotDateTime ? (
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-900">
                            {new Date(booking.slotDateTime).toLocaleDateString(
                              "en-IN",
                            )}
                          </span>
                          <Clock className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-900">
                            {new Date(
                              `1970-01-01T${booking.slotDateTime
                                ?.split("T")[1]
                                ?.slice(0, 5)}`,
                            ).toLocaleTimeString("en-IN", {
                              hour: "numeric",
                              minute: "2-digit",
                              hour12: true,
                            })}
                          </span>
                        </div>
                      ) : (
                        "N/A"
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Total Tickets
                    </label>
                    <p className="text-slate-900 font-medium mt-1 flex items-center gap-2">
                      <Users className="w-4 h-4 text-slate-400" />
                      {booking.totalSeats || 0} tickets
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Total Amount
                    </label>
                    <p className="text-2xl font-bold text-emerald-600 mt-1">
                      ₹{booking.totalAmount?.toLocaleString() || 0}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Status
                    </label>
                    <div className="mt-1">
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${booking.status === "PAID"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                            : booking.status === "PENDING"
                              ? "bg-yellow-50 text-yellow-700 border border-yellow-100"
                              : booking.status === "CANCELLED"
                                ? "bg-red-50 text-red-700 border border-red-100"
                                : "bg-slate-50 text-slate-700 border border-slate-100"
                          }`}
                      >
                        {booking.status || "PENDING"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="border-b border-slate-100 px-6 py-4">
                <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                  <Ticket className="w-5 h-5 text-slate-600" />
                  Tickets
                </h2>
              </div>

              <div className="p-6">
                {booking?.tickets?.length > 0 ? (
                  <div className="space-y-4">
                    {booking.tickets.map((ticket) => (
                      <div
                        key={ticket.id}
                        className="border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
                      >
                        {/* Ticket ID */}
                        <div>
                          <p className="text-xs uppercase text-slate-500 font-semibold">
                            Ticket ID
                          </p>

                          <p className="text-slate-900 font-medium break-all">
                            {ticket.id}
                          </p>
                        </div>

                        {/* Status */}
                        <div>
                          <span
                            className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${ticket.status === "SCANNED"
                                ? "bg-blue-50 text-blue-700 border border-blue-100"
                                : ticket.status === "PENDING"
                                  ? "bg-yellow-50 text-yellow-700 border border-yellow-100"
                                  : "bg-emerald-50 text-emerald-700 border border-emerald-100"
                              }`}
                          >
                            {ticket.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500">No tickets found</p>
                )}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Payment Information */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="border-b border-slate-100 px-6 py-4">
                <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-slate-600" />
                  Payment Information
                </h2>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Transaction ID
                  </label>
                  <p className="text-slate-900 font-mono text-sm mt-1 break-all">
                    {booking.txnId || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Payment ID
                  </label>
                  <p className="text-slate-900 font-mono text-sm mt-1 break-all">
                    {booking.paymentId || "N/A"}
                  </p>
                </div>
              </div>
            </div>

            {/* Ticket Types */}
            {/* Ticket Types */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="border-b border-slate-100 px-6 py-4">
                <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                  <Ticket className="w-5 h-5 text-slate-600" />
                  Ticket Types
                </h2>
              </div>

              <div className="p-6">
                {booking?.tickets?.length > 0 ? (
                  <div className="space-y-4">
                    {Object.values(
                      booking.tickets.reduce((acc, ticket) => {
                        const typeId = ticket.type?.id;

                        if (!acc[typeId]) {
                          acc[typeId] = {
                            typeName: ticket.type?.name,
                            quantity: 0,
                          };
                        }

                        acc[typeId].quantity += 1;

                        return acc;
                      }, {}),
                    ).map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between border border-slate-100 rounded-xl p-4"
                      >
                        <div>
                          <p className="font-semibold text-slate-900">
                            {item.typeName}
                          </p>
                        </div>

                        <div className="text-sm text-slate-500">
                          Quantity: {item.quantity}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500">No ticket types found</p>
                )}
              </div>
            </div>

            {/* Addons */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="border-b border-slate-100 px-6 py-4">
                <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-slate-600" />
                  Addons
                </h2>
              </div>

              <div className="p-6">
                {booking?.bookingAddon?.length > 0 ? (
                  <div className="space-y-4">
                    {booking.bookingAddon.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between border border-slate-100 rounded-xl p-4"
                      >
                        <div>
                          <p className="font-semibold text-slate-900">
                            {item.addon?.name}
                          </p>

                          <p className="text-sm text-slate-500">
                            Quantity: {item.quantity}
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="font-bold text-emerald-600">
                            ₹{item.price}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500">No addons selected</p>
                )}
              </div>
            </div>

            {/* Booking Summary */}
            <div className="bg-linear-to-br from-slate-50 to-indigo-50 rounded-xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-6">
                <h3 className="font-semibold text-slate-900 mb-3">
                  Booking Summary
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Total Amount:</span>
                    <span className="font-bold text-slate-700 text-lg">
                      ₹{booking.totalAmount?.toLocaleString() || 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
