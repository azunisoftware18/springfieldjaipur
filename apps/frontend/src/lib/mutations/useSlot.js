import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api";

// 🔹 CREATE TEMPLATE
export const useCreateSlotTemplate = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (payload) => {
      const res = await api.post("/slot/template", payload);
      return res?.data?.data;
    },
    onSuccess: (_, payload) => {
      qc.invalidateQueries({
        queryKey: ["slotTemplates", payload.placeId],
      });
    },
  });
};

// 🔹 UPDATE TEMPLATE
export const useUpdateSlotTemplate = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }) => {
      const res = await api.put(`/slot/template/${id}`, payload);
      return res?.data?.data;
    },
    onSuccess: (_, variables) => {
      qc.invalidateQueries({
        queryKey: ["slotTemplates", variables.payload.placeId],
      });
    },
  });
};

// 🔹 DELETE TEMPLATE
export const useDeleteSlotTemplate = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, placeId }) => {
      await api.delete(`/slot/template/${id}`);
      return { id, placeId };
    },
    onSuccess: (_, variables) => {
      qc.invalidateQueries({
        queryKey: ["slotTemplates", variables.placeId],
      });
    },
  });
};

// 🔹 OVERRIDE SLOT
export const useOverrideSlot = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (payload) => {
      const res = await api.post("/slot/override", payload);
      return res?.data?.data;
    },
    onSuccess: (_, payload) => {
      qc.invalidateQueries({
        queryKey: ["slots", payload.placeId],
      });
    },
  });
};