import axios from "axios";
import * as SecureStore from "expo-secure-store";

export const BASE_URL = "http://192.168.29.165:3000/api";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

// Attach JWT token to every request
api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync("userToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    if (err.response?.status === 401) {
      await SecureStore.deleteItemAsync("userToken");
    }
    return Promise.reject(err);
  }
);

export default api;
