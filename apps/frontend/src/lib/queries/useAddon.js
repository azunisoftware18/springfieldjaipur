import { useQuery } from "@tanstack/react-query";
import api from "../api";

// 🔥 GET ADDONS
export const useAddons = (placeId, type = "all") => {
  return useQuery({
    queryKey: ["addons", placeId, type],

    queryFn: async () => {
      const res = await api.post("/addon", {
        action: "getAll",

        data: {
          placeId,
          type, // "all" | "active"
        },
      });

      return res?.data?.data;
    },

    enabled: !!placeId,
  });
};