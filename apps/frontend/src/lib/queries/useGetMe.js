import { useQuery } from "@tanstack/react-query";
import api from "../api";
import { useDispatch } from "react-redux";
import { login, logout, setAuthChecked } from "@/store/slices/authSlice";

export const useGetMe = () => {
  const dispatch = useDispatch();

  return useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      try {
        const res = await api.get("/auth");

        const user = res?.data?.data;

        if (!user) {
          // 🔥 invalid response
          dispatch(logout());
          return null;
        }

        dispatch(login(user));
        return user;
      } catch (error) {
        // 🔥 401 / no cookie
        dispatch(logout());
        return null;
      } finally {
        dispatch(setAuthChecked());
      }
    },
    retry: false,
  });
};