"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import {
  Home,
  Ticket,
  Map,
  ChevronRight,
  LogOut,
  Menu,
  X,
  Star,
  Calendar,
  TicketIcon,
  Camera,
  MapPlus,
  BookCheck,
  Scan,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useLogout } from "@/lib/mutations/useLogout";

const menuItems = [
  { icon: Home, label: "Dashboard", href: "/dashboard" },
  { icon: Map, label: "Place", href: "/dashboard/place" },
  { icon: Calendar, label: "Slots", href: "/dashboard/slots" },
  { icon: TicketIcon, label: "Ticket Type", href: "/dashboard/ticket" },
  { icon: MapPlus, label: "Addon", href: "/dashboard/addon" },
  { icon: BookCheck, label: "Booking", href: "/dashboard/booking" },
  { icon: Scan, label: "Ticket Scanner", href: "/dashboard/ticket-scanner" },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const { mutate: logoutUser, isPending } = useLogout();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const springConfig = { type: "spring", stiffness: 350, damping: 35 };

  if (!mounted) return null;

  return (
    <LayoutGroup>
      <motion.aside
        layout
        initial={false}
        animate={{ width: isOpen ? "280px" : "88px" }}
        transition={springConfig}
        // Using your --sidebar and --sidebar-border variables
        style={{
          backgroundColor: "var(--sidebar)",
          color: "var(--sidebar-foreground)",
          borderColor: "var(--sidebar-border)",
        }}
        className="relative flex flex-col h-screen border-r z-50 overflow-hidden shadow-sm shrink-0"
      >
        {/* --- HEADER --- */}
        <div className="flex items-center h-24 px-6 shrink-0">
          <div className="flex items-center justify-between w-full">
            <AnimatePresence mode="popLayout" initial={false}>
              {isOpen && (
                <motion.div
                  key="logo"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="flex items-center gap-3 origin-left"
                >
                  {/* Logo using your --sidebar-primary */}
                  <div
                    style={{ backgroundColor: "var(--sidebar-primary)" }}
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm"
                  >
                    <Ticket
                      style={{ color: "var(--sidebar-primary-foreground)" }}
                      size={22}
                    />
                  </div>
                  <span
                    className="font-black text-xl tracking-tighter italic uppercase"
                    style={{ color: "var(--sidebar-foreground)" }}
                  >
                    Go
                    <span style={{ color: "var(--muted-foreground)" }}>
                      Ticket
                    </span>
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              layout
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsOpen(!isOpen)}
              style={{ borderColor: "var(--sidebar-border)" }}
              className="p-2.5 rounded-xl border hover:bg-sidebar-accent transition-colors duration-200"
            >
              {isOpen ? <X size={18} /> : <Menu size={18} />}
            </motion.button>
          </div>
        </div>

        {/* --- NAVIGATION --- */}
        <nav className="flex-1 px-4 space-y-2 overflow-y-auto overflow-x-hidden">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <motion.div
                  layout
                  className="relative flex items-center gap-4 px-4 py-4 rounded-lg cursor-pointer group transition-all duration-300"
                  style={{
                    backgroundColor: isActive
                      ? "var(--sidebar-accent)"
                      : "transparent",
                    color: isActive
                      ? "var(--sidebar-accent-foreground)"
                      : "var(--sidebar-foreground)",
                  }}
                >
                  <item.icon
                    size={22}
                    className={`shrink-0 transition-transform ${isActive ? "scale-110" : "group-hover:scale-110"}`}
                  />

                  <AnimatePresence mode="popLayout" initial={false}>
                    {isOpen && (
                      <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="font-medium text-sm whitespace-nowrap"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>

                  {isActive && isOpen && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="ml-auto"
                      style={{ color: "var(--sidebar-primary)" }}
                    >
                      <ChevronRight size={14} />
                    </motion.div>
                  )}
                </motion.div>
              </Link>
            );
          })}
        </nav>

        {/* --- FOOTER --- */}
        <div className="p-4 mt-auto">
          <motion.div
            layout
            style={{
              backgroundColor: "var(--secondary)",
              borderColor: "var(--border)",
            }}
            className="rounded-2xl p-2 border overflow-hidden"
          >
            <button
              onClick={() => {
                logoutUser(undefined, {
                  onSuccess: () => {
                    // 🔥 React Query cache clear
                    queryClient.clear();

                    // 🔥 Hard reload (important)
                    window.location.href = "/login";
                  },
                });
              }}
              className="flex items-center gap-4 w-full px-4 py-4 rounded-xl text-destructive hover:bg-(--destructive)/10 transition-colors duration-200 group"
            >
              <LogOut
                size={22}
                className="shrink-0 group-hover:-translate-x-1 transition-transform"
              />
              {isOpen && (
                <span className="font-bold text-sm">
                  {isPending ? "Signing out..." : "Sign Out"}
                </span>
              )}
            </button>
          </motion.div>
        </div>
      </motion.aside>
    </LayoutGroup>
  );
}
