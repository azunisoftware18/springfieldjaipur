"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000/api";

export default function PaymentReturnPage() {
  const searchParams = useSearchParams();

  const orderId = searchParams.get("order_id");

  const [status, setStatus] = useState("VERIFYING");
  const [message, setMessage] = useState(
    "Please wait while we verify your payment..."
  );
  const [bookingId, setBookingId] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  const verifyPayment = useCallback(async () => {
    if (!orderId) {
      setStatus("ERROR");
      setMessage("Payment order ID was not received.");
      return;
    }

    setStatus("VERIFYING");
    setMessage("Please wait while we verify your payment.");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/booking/payment/verify`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ orderId }),
          cache: "no-store",
        }
      );

      const result = await response.json();

      if (!response.ok || result?.success === false) {
        const errorMessage =
          result?.message || "Payment verification could not be completed.";

        // The backend may report that payment is still pending.
        if (/pending|not paid|processing/i.test(errorMessage)) {
          setStatus("PENDING");
          setMessage(
            "Your payment is not confirmed yet. Please try checking again."
          );
          return;
        }

        throw new Error(errorMessage);
      }

      // Support common API response structures.
      const data = result?.data?.data ?? result?.data ?? result;
      const booking = data?.booking ?? data;

      const bookingStatus = String(
        booking?.status ?? data?.status ?? ""
      ).toUpperCase();

      const paymentStatus = String(
        data?.paymentStatus ?? data?.orderStatus ?? ""
      ).toUpperCase();

      const isPaid =
        bookingStatus === "PAID" ||
        paymentStatus === "PAID" ||
        data?.verified === true;

      if (!isPaid) {
        setStatus("PENDING");
        setMessage(
          "We received your request, but the payment is not confirmed yet."
        );
        return;
      }

      setStatus("SUCCESS");
      setMessage("Your payment has been verified successfully.");

      setBookingId(
        booking?.id ||
          data?.bookingId ||
          data?.booking?.id ||
          ""
      );
    } catch (error) {
      console.error("Cashfree payment verification error:", error);

      setStatus("ERROR");
      setMessage(
        error?.message ||
          "Unable to verify your payment. Please try again."
      );
    }
  }, [orderId]);

  useEffect(() => {
    verifyPayment();
  }, [verifyPayment, retryCount]);

  const isVerifying = status === "VERIFYING";

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <section className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-10">
        <div
          className={`mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full ${
            status === "SUCCESS"
              ? "bg-green-100 text-green-600"
              : status === "ERROR"
              ? "bg-red-100 text-red-600"
              : status === "PENDING"
              ? "bg-amber-100 text-amber-600"
              : "bg-blue-100 text-blue-600"
          }`}
        >
          {isVerifying ? (
            <div className="h-9 w-9 animate-spin rounded-full border-4 border-current border-t-transparent" />
          ) : status === "SUCCESS" ? (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              className="h-10 w-10"
            >
              <path
                d="m5 12 4 4L19 6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : status === "PENDING" ? (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-10 w-10"
            >
              <circle cx="12" cy="12" r="9" />
              <path
                d="M12 7v5l3 2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-10 w-10"
            >
              <path
                d="M12 8v5m0 4h.01M10.3 3.9 2.8 17a2 2 0 0 0 1.7 3h15a2 2 0 0 0 1.7-3l-7.5-13.1a2 2 0 0 0-3.4 0Z"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </div>

        <h1 className="mb-3 text-2xl font-bold text-slate-900">
          {status === "SUCCESS"
            ? "Payment Successful!"
            : status === "PENDING"
            ? "Payment Pending"
            : status === "ERROR"
            ? "Verification Issue"
            : "Verifying Payment"}
        </h1>

        <p className="mb-6 text-sm leading-6 text-slate-600">
          {message}
        </p>

        {orderId && (
          <div className="mb-6 rounded-lg bg-slate-50 p-4 text-left">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Order ID
            </p>
            <p className="mt-1 break-all text-sm font-semibold text-slate-800">
              {orderId}
            </p>

            {bookingId && (
              <>
                <p className="mt-4 text-xs font-medium uppercase tracking-wide text-slate-500">
                  Booking ID
                </p>
                <p className="mt-1 break-all text-sm font-semibold text-slate-800">
                  {bookingId}
                </p>
              </>
            )}
          </div>
        )}

        {status === "SUCCESS" && (
          <Link
            href={
              bookingId
                ? `/payment-success?bookingId=${encodeURIComponent(bookingId)}`
                : "/"
            }
            className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            {bookingId ? "View Booking Confirmation" : "Back to Home"}
          </Link>
        )}

        {(status === "ERROR" || status === "PENDING") && (
          <button
            type="button"
            onClick={() => setRetryCount((count) => count + 1)}
            className="w-full rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            Check Payment Again
          </button>
        )}

        {status !== "SUCCESS" && (
          <p className="mt-5 text-xs leading-5 text-slate-500">
            Please do not make another payment while your current
            payment status is being checked.
          </p>
        )}
      </section>
    </main>
  );
}