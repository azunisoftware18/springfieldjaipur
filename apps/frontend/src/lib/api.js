import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    console.warn("API Error:", err.response?.data || err.message);

    return Promise.reject(err); // 🔥 IMPORTANT (revert back)
  }
);

export default api;