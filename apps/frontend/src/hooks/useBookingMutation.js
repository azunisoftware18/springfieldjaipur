import { useMutation } from "@tanstack/react-query";
import api from "../lib/api";

export const useBookingMutation = () => {
    return useMutation({
        mutationFn: async (payload) => {
            const { data } = await api.post("/booking", payload);
            return data;
        },
        onError: (error) => {
            console.error(
                "Booking Submission Error:",
                error?.response?.data || error?.message || error
            );
        },
    });
};
    