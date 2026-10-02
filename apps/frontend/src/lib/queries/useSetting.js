import { useQuery } from "@tanstack/react-query";
import api from "../api";

export const useGetSetting = () => {
  return useQuery({
    queryKey: ["setting"],

    queryFn: async () => {
      const res = await api.get("/setting");
      return res.data.data;
    },
  });
};