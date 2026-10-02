import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export const useSlots = ({ placeId, date, }) => {
    return useQuery({
        queryKey: ["slots", placeId, date],
        queryFn: async () => {
            if (!placeId || !date) return [];
            const res = await api.get(`/slot/slots/${placeId}/${date}`);
            return res?.data?.data || [];
        },
        enabled: !!placeId && !!date,
    });
};