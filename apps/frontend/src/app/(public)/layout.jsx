"use client";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import LayoutWrapper from "@/components/LayoutWrapper";
import SmoothScrollProvider from "@/providers/SmoothScrollProvider";

export default function PublicLayout({ children }) {
  return (
    <>
      <SmoothScrollProvider>
        {/* <RoyalCursor /> */}
        <LayoutWrapper>{children}</LayoutWrapper>
      </SmoothScrollProvider>
    </>
  );
}
