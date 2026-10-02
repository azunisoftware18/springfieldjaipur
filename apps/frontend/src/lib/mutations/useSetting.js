import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api";

export const useUpdateSetting = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (payload) => {
      const res = await api.put("/setting", payload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return res.data.data;
    },

    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["setting"],
      });
    },
  });
};