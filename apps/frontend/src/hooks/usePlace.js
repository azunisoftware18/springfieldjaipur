import { useQuery } from "@tanstack/react-query";
import api from "../lib/api";
 
export const usePlaces = (options = {}) => {
    return useQuery({
        queryKey: ["places"],
        queryFn: async () => {
            const res = await api.get("/place");
            return res?.data?.data || [];
        },
        ...options,
    });
};
 
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