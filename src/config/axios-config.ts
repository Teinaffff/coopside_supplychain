import axios from "axios";

const baseURL = (import.meta as any).env.VITE_BACKEND_URL;

const API = axios.create({
  baseURL,
  headers: {
    "Content-Type": "Application/json",
  },
  timeout: 10000,
});

export default API;
