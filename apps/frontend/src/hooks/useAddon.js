import { useQuery } from "@tanstack/react-query";

import api from "../lib/api";

export const useAddons = (placeId, type = "active") => {
    return useQuery({
        queryKey: ["addons", placeId, type,],

        queryFn: async () => {
            const res = await api.post("/addon", {
                action: "getAll",
                data: {
                    placeId,
                    type,
                },
            }
            );
            return res?.data?.data || [];
        },
        enabled: !!placeId,
    });
};