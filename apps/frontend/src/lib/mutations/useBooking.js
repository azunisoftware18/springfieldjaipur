"use client";

import { useMutation } from "@tanstack/react-query";
import api from "../api";

export const useCreateBooking = () => {
  return useMutation({
    mutationFn: async (payload) => {
      const res = await api.post("/booking", payload);

      return res?.data?.data;
    },
  });
};