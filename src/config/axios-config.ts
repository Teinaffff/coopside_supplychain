import axios from "axios";


const baseURL = (import.meta as any).env.VITE_BACKEND_URL || "/api";

const API = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json; charset=utf-8",
    Accept: "application/json",
  },
  timeout: 10000,
});

// Basic request/response logging to help debug API payloads and errors
API.interceptors.request.use((config) => {
  try {
    // eslint-disable-next-line no-console
    console.log("[API REQUEST]", config.method?.toUpperCase(), config.url, config.data);
  } catch {}
  return config;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    try {
      // eslint-disable-next-line no-console
      console.error("[API ERROR]", error?.response?.status, error?.config?.url, error?.response?.data || error?.message);
    } catch {}
    return Promise.reject(error);
  }
);

export default API;
