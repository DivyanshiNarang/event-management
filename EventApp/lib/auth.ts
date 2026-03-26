import * as SecureStore from "expo-secure-store";
import api from "./api";

export async function login(email: string, password: string) {
  const { data } = await api.post("/auth/login", { email, password });
  await SecureStore.setItemAsync("userToken", data.token);
  await SecureStore.setItemAsync("userData", JSON.stringify(data.user));
  return data;
}

export async function register(name: string, email: string, password: string) {
  const { data } = await api.post("/auth/register", { name, email, password });
  await SecureStore.setItemAsync("userToken", data.token);
  await SecureStore.setItemAsync("userData", JSON.stringify(data.user));
  return data;
}

export async function logout() {
  await SecureStore.deleteItemAsync("userToken");
  await SecureStore.deleteItemAsync("userData");
}

export async function getStoredUser() {
  const raw = await SecureStore.getItemAsync("userData");
  return raw ? JSON.parse(raw) : null;
}

export async function getToken() {
  return SecureStore.getItemAsync("userToken");
}
