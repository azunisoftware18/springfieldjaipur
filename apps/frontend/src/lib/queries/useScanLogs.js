"use client";

import { useQuery } from "@tanstack/react-query";
import api from "../api";

export const useScanLogs = () => {
  return useQuery({

    queryKey: ["scanLogs"],

    queryFn: async () => {

      const res = await api.get("/scan-log");

      return res?.data?.data;
    },
  });
};