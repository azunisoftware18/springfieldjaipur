"use client";

import DashboardNavbar from "@/components/DashboardNavbar";
import Sidebar from "@/components/Sidebar";

import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Menu, X } from "lucide-react";

import { usePlaces } from "@/lib/queries/usePlace";
import { setCurrentPlace } from "@/store/slices/placeSlice";

export default function DashboardLayout({ children }) {
  const { isAuthChecked, isLoggedIn } = useSelector(
    (state) => state.auth
  );

  const router = useRouter();
  const dispatch = useDispatch();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { data: places } = usePlaces();

  // 🔥 Redirect if not logged in
  useEffect(() => {
    if (isAuthChecked && !isLoggedIn) {
      router.replace("/login");
    }
  }, [isAuthChecked, isLoggedIn, router]);

  // 🔥 Set current place
  useEffect(() => {
    if (places?.length > 0) {
      dispatch(setCurrentPlace(places[0]));
    }
  }, [places, dispatch]);

  // 🔥 Loading screen
  if (!isAuthChecked) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      
      {/* ===================== */}
      {/* MOBILE SIDEBAR OVERLAY */}
      {/* ===================== */}

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ===================== */}
      {/* SIDEBAR */}
      {/* ===================== */}

      <div
        className={`
          fixed lg:static top-0 left-0 z-50
          h-screen transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        <Sidebar />

        {/* MOBILE CLOSE BUTTON */}
        <button
          onClick={() => setSidebarOpen(false)}
          className="absolute top-4 right-4 lg:hidden bg-white shadow-md rounded-full p-2"
        >
          <X size={18} />
        </button>
      </div>

      {/* ===================== */}
      {/* MAIN CONTENT */}
      {/* ===================== */}

      <div className="flex-1 flex flex-col min-w-0">
        
        {/* TOP NAVBAR */}
        <div className="shrink-0 bg-white border-b border-slate-200">
          
          {/* MOBILE HEADER */}
          <div className="flex items-center justify-between px-4 py-3 lg:hidden">
            
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 transition"
            >
              <Menu size={22} />
            </button>

            <h1 className="text-lg font-black text-slate-800">
              Dashboard
            </h1>
          </div>

          {/* DESKTOP NAVBAR */}
          <div className="hidden lg:block">
            <DashboardNavbar />
          </div>
        </div>

        {/* PAGE CONTENT */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}