"use client";

import { useGetMe } from "@/lib/queries/useGetMe";

export default function AuthLoader({ children }) {
  useGetMe();

  return children;
}