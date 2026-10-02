import { useMutation } from "@tanstack/react-query";
import api from "../api";
import { useDispatch } from "react-redux";
import { logout } from "@/store/slices/authSlice";

export const useLogout = () => {
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: async () => {
      await api.post("/auth/logout");
    },

    onSuccess: () => {
      dispatch(logout());
    },
  });
};