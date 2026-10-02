import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api";

export const useHandleAddon = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (payload) => {
      const res = await api.post("/addon", payload);

      return res?.data?.data;
    },

    onSuccess: (_, variables) => {
      qc.invalidateQueries({
        queryKey: ["addons", variables?.data?.placeId],
      });
    },
  });
};