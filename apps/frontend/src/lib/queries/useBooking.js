'use client';

import { useQuery } from "@tanstack/react-query";
import api from "../api";

export const useBookings = () => {
  return useQuery({
    queryKey: ["bookings"],

    queryFn: async () => {
      const res = await api.get("/booking/all");

      return res?.data?.data;
    },
  });
};

export const useBookingById = (id) => {
  return useQuery({
    queryKey: ["booking", id],

    queryFn: async () => {
      const res = await api.get(`/booking/${id}`);

      return res?.data?.data;
    },

    enabled: !!id,
  });
};