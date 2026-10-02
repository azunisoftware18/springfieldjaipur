import { useQuery } from "@tanstack/react-query";
import api from "../api";

export const useTickets = () => {
  return useQuery({
    queryKey: ["tickets"],

    queryFn: async () => {

      const res = await api.get("/ticket");

      return res?.data?.data;
    },
  });
};