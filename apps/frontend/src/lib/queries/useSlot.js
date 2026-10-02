import { useQuery } from "@tanstack/react-query";
import api from "../api";

// 🔹 GET SLOTS BY DATE
export const useSlots = ({ placeId, date }) => {
  return useQuery({
    queryKey: ["slots", placeId, date],
    queryFn: async () => {
      const res = await api.get(`/slot/slots/${placeId}/${date}`);
      return res?.data?.data;
    },
    enabled: !!placeId && !!date,
  });
};

// 🔹 GET SLOT TEMPLATES
export const useSlotTemplates = (placeId) => {
  return useQuery({
    queryKey: ["slotTemplates", placeId],
    queryFn: async () => {
      const res = await api.get(`/slot/template/${placeId}`);
      return res?.data?.data;
    },
    enabled: !!placeId,
  });
};

export const useOverrides = ({
  placeId,
  date,
}) => {
  return useQuery({
    queryKey: ["overrides", placeId, date],

    queryFn: async () => {
      const res = await api.get(
        `/slot/override/${placeId}/${date}`
      );

      return res?.data?.data;
    },

    enabled: !!placeId && !!date,
  });
};