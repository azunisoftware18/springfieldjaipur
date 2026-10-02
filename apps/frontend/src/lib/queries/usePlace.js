import { useQuery } from "@tanstack/react-query";
import api from "../api";

// 🔹 GET ALL PLACES
export const usePlaces = () => {
  return useQuery({
    queryKey: ["places"],
    queryFn: async () => {
      const res = await api.get("/place");
      return res?.data?.data || [];
    },
  });
};

// 🔹 GET PLACE BY ID
export const usePlaceById = (id) => {
  return useQuery({
    queryKey: ["place", id],
    queryFn: async () => {
      const res = await api.get(`/place/${id}`);
      return res?.data?.data;
    },
    enabled: !!id,
  });
};