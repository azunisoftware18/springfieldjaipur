"use client";
import React from 'react';
import { useRouter } from 'next/navigation';

export default function Status({ status, data, onRetry }) {
    const router = useRouter();
    const visitorName = data?.visitorInfo?.name || data?.name || "Guest";
    const visitorEmail = data?.visitorInfo?.email || data?.email || "your email";
    const bookingDate = data?.date || "N/A";
    const txnId = data?.txnId || "N/A";

    return (
        <div className="text-center py-6 text-black">
            {status === "success" ? (
                <div className="animate-in fade-in zoom-in duration-500">
                    <div className="flex justify-center mb-6">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                            <span className="text-5xl text-green-600">✓</span>
                        </div>
                    </div>
                    <h2 className="text-3xl font-bold text-green-600 mb-2">Booking Confirmed!</h2>
                    <p className="text-gray-600 mb-8 font-medium">
                        Your ticket has been sent to <br />
                        <span className="text-black font-semibold">{visitorEmail}</span>
                    </p>
                    <div className="bg-white p-6 rounded-2xl border-2 border-dashed border-gray-300 text-left mb-8 relative overflow-hidden">
                        <div className="absolute top-1/2 -left-3 w-6 h-6 bg-[#f6f1e8] rounded-full border-r-2 border-gray-300 transform -translate-y-1/2"></div>
                        <div className="absolute top-1/2 -right-3 w-6 h-6 bg-[#f6f1e8] rounded-full border-l-2 border-gray-300 transform -translate-y-1/2"></div>

                        <div className="space-y-4">
                            <div>
                                <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-bold">Transaction ID</p>
                                <p className="font-mono text-sm text-gray-700">#{txnId}</p>
                            </div>

                            <div className="border-t border-gray-100 pt-4">
                                <h3 className="font-bold text-xl text-orange-800">Jaipur Experience</h3>
                                <div className="grid grid-cols-2 gap-4 mt-3">
                                    <div>
                                        <p className="text-xs text-gray-500 italic">Date</p>
                                        <p className="font-bold text-sm">{bookingDate}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 italic">Visitor</p>
                                        <p className="font-bold text-sm truncate">{visitorName}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <button
                            onClick={() => window.print()}
                            className="w-full bg-[#c14d26] hover:bg-[#a34120] text-white py-4 rounded-xl font-bold shadow-lg transition-all active:scale-95"
                        >
                            Download E-Ticket
                        </button>
                        <button
                            onClick={() => router.push("/")}
                            className="w-full text-gray-500 font-bold py-2 hover:text-black transition-colors"
                        >
                            Back to Home
                        </button>
                    </div>
                </div>
            ) : (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex justify-center mb-6">
                        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                            <span className="text-5xl text-red-600">✕</span>
                        </div>
                    </div>

                    <h2 className="text-3xl font-bold text-red-600 mb-2">Payment Failed</h2>
                    <p className="text-gray-600 mb-8 font-medium px-4">
                        Oops! Something went wrong while processing your payment. Don't worry, if any amount was deducted, it will be refunded.
                    </p>

                    <div className="flex flex-col gap-3 px-4">
                        <button
                            onClick={onRetry}
                            className="w-full bg-orange-700 hover:bg-orange-800 text-white py-4 rounded-xl font-bold shadow-md transition-all active:scale-95"
                        >
                            Try Paying Again
                        </button>
                        <button
                            onClick={() => router.push("/")}
                            className="w-full border-2 border-gray-200 text-gray-700 py-4 rounded-xl font-bold hover:bg-gray-50 transition-all"
                        >
                            Cancel & Exit
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}