import { useQuery } from "@tanstack/react-query";
import api from "../api";

// 🔥 GET ALL TICKET TYPES
export const useTicketTypes = (placeId) => {
  return useQuery({
    queryKey: ["ticketTypes", placeId],

    queryFn: async () => {
      const payload = {
        action: "getAll",

        data: {
          placeId,
        },
      };

      const res = await api.post("/ticket-type/public", payload);

      return res?.data?.data;
    },

    enabled: !!placeId,
  });
};