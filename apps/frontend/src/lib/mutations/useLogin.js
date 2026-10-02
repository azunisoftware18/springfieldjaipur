import { useMutation } from "@tanstack/react-query";
import api from "../api";
import { useDispatch } from "react-redux";
import { login } from "@/store/slices/authSlice";
import { useRouter } from "next/navigation";

export const useLogin = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  return useMutation({
    mutationFn: async (credentials) => {
      const { data } = await api.post("/auth/login", credentials);
      return data;
    },

    onSuccess: (res) => {
      const user = res.data.user;

      dispatch(login(user));

      // 🔥 YE MOST IMPORTANT HAI
      router.replace("/dashboard");
    },
  });
};

export const useUpdateProfile = () => {

  const dispatch = useDispatch();

  return useMutation({
    mutationFn: async (payload) => {

      const { data } = await api.put(
        "/auth/profile",
        payload
      );

      return data;
    },

    onSuccess: (res) => {

      dispatch(login(res.data));
    },
  });
};

// 🔥 UPDATE PASSWORD
export const useUpdatePassword = () => {

  return useMutation({
    mutationFn: async (payload) => {

      const { data } = await api.put(
        "/auth/password",
        payload
      );

      return data;
    },
  });
};