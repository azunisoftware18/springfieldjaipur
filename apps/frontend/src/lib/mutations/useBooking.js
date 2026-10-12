"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api";

export const useCreateBooking = () => {
  return useMutation({
    mutationFn: async (payload) => {
      const res = await api.post("/booking", payload);

      return res?.data?.data;
    },
  });
};

export const useDeleteBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      await api.delete(`/booking/${id}`);
      return id;
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({
        queryKey: ["bookings"],
      });
      queryClient.removeQueries({
        queryKey: ["booking", id],
        exact: true,
      });
    },
  });
};