"use client";

import { useMutation } from "@tanstack/react-query";
import api from "../api";

export const useScanTicket = () => {
  return useMutation({
    mutationFn: async (payload) => {

      const res = await api.post(
        "/ticket/scan",
        payload
      );

      return res?.data?.data;
    },
  });
};