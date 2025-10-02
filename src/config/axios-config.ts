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

// Request interceptor to add authentication token
API.interceptors.request.use((config) => {
  try {
    // Get access token from localStorage
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    
    // eslint-disable-next-line no-console
    console.log("[API REQUEST]", config.method?.toUpperCase(), config.url, config.data);
  } catch {}
  return config;
});

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    try {
      // eslint-disable-next-line no-console
      console.error("[API ERROR]", error?.response?.status, error?.config?.url, error?.response?.data || error?.message);
      
      // Handle 401 Unauthorized - token might be expired
      if (error?.response?.status === 401) {
        const refreshToken = localStorage.getItem("refreshToken");
        if (refreshToken) {
          try {
            // Attempt to refresh the token
            const refreshResponse = await API.post("/v1/auth/refresh-token", {
              refreshToken,
            });
            
            if (refreshResponse.data?.data?.accessToken) {
              const newAccessToken = refreshResponse.data.data.accessToken;
              localStorage.setItem("accessToken", newAccessToken);
              
              // Retry the original request with the new token
              error.config.headers.Authorization = `Bearer ${newAccessToken}`;
              return API(error.config);
            }
          } catch (refreshError) {
            // Refresh failed, redirect to login
            console.error("[TOKEN REFRESH FAILED]", refreshError);
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            // You might want to dispatch a logout action here
            // dispatch(logout());
          }
        } else {
          // No refresh token, redirect to login
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
        }
      }
    } catch {}
    return Promise.reject(error);
  }
);

export default API;
