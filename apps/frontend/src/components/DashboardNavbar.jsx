"use client";

import React, { useState, useRef, useEffect } from "react";
import { User, ChevronDown, LogOut, Settings, Shield, UserCog, LayoutDashboard, Calendar, MapPin, Ticket, BookOpen, ScanLine, Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useLogout } from "@/lib/mutations/useLogout";

export default function DashboardNavbar() {
  const { user } = useSelector((state) => state.auth);
  const pathname = usePathname();
  const router = useRouter();
  const { mutate: logoutUser, isPending } = useLogout();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const getPageTitle = (pathname) => {
    if (pathname === "/dashboard") return "Dashboard";
    if (pathname === "/dashboard/place") return "Place Management";
    if (pathname === "/dashboard/slots") return "Slots Management";
    if (pathname === "/dashboard/ticket") return "Ticket Types";
    if (pathname === "/dashboard/addon") return "Addon Management";
    if (pathname === "/dashboard/booking") return "Bookings";
    if (pathname === "/dashboard/ticket-scanner") return "Ticket Scanner";
    return "Dashboard";
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleProfileClick = () => {
    router.push("/dashboard/profile");
    setIsDropdownOpen(false);
  };

  const handleSettingsClick = () => {
    router.push("/dashboard/website-setting");
    setIsDropdownOpen(false);
  };

  const handleLogout = () => {
    logoutUser(undefined, {
      onSuccess: () => {
        // Clear React Query cache
        queryClient.clear();
        
        // Clear localStorage/sessionStorage if any
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        sessionStorage.clear();
        
        // Hard reload and redirect to login
        window.location.href = "/login";
      },
      onError: (error) => {
        console.error("Logout failed:", error);
        // Still redirect on error
        window.location.href = "/login";
      },
    });
  };

  // Navigation items for super admin
  const adminNavItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Place", href: "/dashboard/place", icon: MapPin },
    { name: "Slots", href: "/dashboard/slots", icon: Calendar },
    { name: "Ticket Type", href: "/dashboard/ticket", icon: Ticket },
    { name: "Addon", href: "/dashboard/addon", icon: BookOpen },
    { name: "Booking", href: "/dashboard/booking", icon: BookOpen },
    { name: "Ticket Scanner", href: "/dashboard/ticket-scanner", icon: ScanLine },
  ];

  return (
    <nav 
      style={{ 
        backgroundColor: "var(--background)", 
        borderColor: "var(--border)" 
      }}
      className="h-20 px-4 md:px-8 flex items-center justify-between border-b sticky top-0 z-40"
    >
      {/* LEFT SIDE - PAGE TITLE */}
      <h1 
        style={{ color: "var(--foreground)" }}
        className="text-xl font-bold tracking-tight"
      >
        {getPageTitle(pathname)}
      </h1>

      {/* RIGHT SIDE - USER DROPDOWN */}
      <div className="flex items-center gap-6">
        <div className="relative" ref={dropdownRef}>
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{ 
              backgroundColor: "var(--secondary)", 
              borderColor: "var(--border)" 
            }}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-3 pl-2 pr-4 py-2 rounded-2xl border cursor-pointer hover:opacity-90 transition-all shadow-sm"
          >
            <div 
              style={{ backgroundColor: "var(--primary)" }}
              className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm shadow-black/5"
            >
              <User style={{ color: "var(--primary-foreground)" }} size={20} />
            </div>

            <div className="hidden lg:block text-left">
              <p 
                style={{ color: "var(--foreground)" }}
                className="text-sm font-bold leading-none tracking-tight"
              >
                {user?.fullName || "Loading..."}
              </p>

              <p 
                style={{ color: "var(--muted-foreground)" }}
                className="text-[10px] font-bold uppercase mt-1 tracking-wider"
              >
                {user?.role || "Admin"}
              </p>
            </div>

            <motion.div
              animate={{ rotate: isDropdownOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown size={14} style={{ color: "var(--muted-foreground)" }} />
            </motion.div>
          </motion.div>

          {/* Dropdown Menu */}
          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                style={{ 
                  backgroundColor: "var(--background)", 
                  borderColor: "var(--border)" 
                }}
                className="absolute right-0 mt-2 w-80 rounded-2xl border shadow-2xl overflow-hidden z-50"
              >
                {/* User Info Header */}
                <div className="p-4 border-b" style={{ borderColor: "var(--border)" }}>
                  <div className="flex items-center gap-3">
                    <div 
                      style={{ backgroundColor: "var(--primary)" }}
                      className="w-12 h-12 rounded-xl flex items-center justify-center shadow-sm"
                    >
                      <User style={{ color: "var(--primary-foreground)" }} size={24} />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-sm" style={{ color: "var(--foreground)" }}>
                        {user?.fullName || "Admin User"}
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>
                        {user?.email || "admin@example.com"}
                      </p>
                      <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-violet-100 text-violet-700">
                        <Shield size={10} />
                        {user?.role || "Super Admin"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick Navigation for Super Admin */}
                {user?.role === "SUPER_ADMIN" && (
                  <div className="p-2 border-b" style={{ borderColor: "var(--border)" }}>
                    <p className="text-[10px] font-bold uppercase tracking-wider px-3 pt-2 pb-1" style={{ color: "var(--muted-foreground)" }}>
                      Quick Navigation
                    </p>
                    <div className="grid grid-cols-2 gap-1 mt-1">
                      {adminNavItems.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setIsDropdownOpen(false)}
                          className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-all ${
                            pathname === item.href
                              ? "bg-violet-50 text-violet-700"
                              : "hover:bg-slate-100"
                          }`}
                          style={{ 
                            backgroundColor: pathname === item.href ? "var(--primary-light)" : "transparent",
                            color: pathname === item.href ? "var(--primary)" : "var(--foreground)"
                          }}
                        >
                          <item.icon size={16} />
                          <span>{item.name}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Menu Items */}
                <div className="p-2">
                  {/* Profile Option */}
                  <button
                    onClick={handleProfileClick}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-100 transition-all"
                    style={{ color: "var(--foreground)" }}
                  >
                    <Settings size={18} />
                    <div className="flex-1 text-left">
                      <p className="text-sm font-medium">Profile Settings</p>
                      <p className="text-[10px]" style={{ color: "var(--muted-foreground)" }}>
                        Manage your account details
                      </p>
                    </div>
                  </button>

                  {/* Settings Option */}
                  <button
                    onClick={handleSettingsClick}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-100 transition-all"
                    style={{ color: "var(--foreground)" }}
                  >
                    <Globe size={18} />
                    <div className="flex-1 text-left">
                      <p className="text-sm font-medium">Website Settings</p>
                      <p className="text-[10px]" style={{ color: "var(--muted-foreground)" }}>
                        Manage Website 
                      </p>
                    </div>
                  </button>

                  {/* Divider */}
                  <div className="my-2 h-px" style={{ backgroundColor: "var(--border)" }} />

                  {/* Logout Option - Same as Sidebar */}
                  <button
                    onClick={handleLogout}
                    disabled={isPending}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-50 transition-all group"
                  >
                    <LogOut size={18} className="text-red-500" />
                    <div className="flex-1 text-left">
                      <p className="text-sm font-medium text-red-600">
                        {isPending ? "Signing out..." : "Sign Out"}
                      </p>
                      <p className="text-[10px] text-red-400">
                        Sign out of your account
                      </p>
                    </div>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </nav>
  );
}