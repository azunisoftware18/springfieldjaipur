"use client";
import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";
export default function LayoutWrapper({ children }) {
    const pathname = usePathname();
    const hideLayout = pathname === "/payment-success" || pathname === "/payment-failure";
    const hideFooterHeader = pathname.startsWith("/book-tickets");


    return (
        <>
            {!hideLayout && !hideFooterHeader && <Header  />}
            <main className={!hideLayout ? "pt-[82px]" : ""}>
                {children}
            </main>
            {!hideLayout && !hideFooterHeader && <Footer />}
        </>
    );
}