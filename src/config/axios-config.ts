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
    const maskedAuth = config.headers?.Authorization ? `${String(config.headers.Authorization).slice(0,8)}...` : null;
    console.log("[API REQUEST]", config.method?.toUpperCase(), config.url, { data: config.data, Authorization: maskedAuth });
  } catch {}
  return config;
});

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    try {
      // eslint-disable-next-line no-console
      const reqUrl = error?.config?.url;
      const status = error?.response?.status;
      const resp = error?.response?.data || error?.message;
      console.error("[API ERROR]", status, reqUrl, resp);
      
      // Handle 401 Unauthorized - token might be expired
      if (status === 401) {
        const refreshToken = localStorage.getItem("refreshToken");
        if (refreshToken) {
          try {
            // eslint-disable-next-line no-console
            console.log("[TOKEN REFRESH] Attempting to refresh access token...");
            // Attempt to refresh the token
            const refreshResponse = await API.post("/v1/auth/refresh-token", {
              refreshToken,
            });
            
            // eslint-disable-next-line no-console
            console.log("[TOKEN REFRESH] Response:", refreshResponse?.data);
            if (refreshResponse.data?.data?.accessToken) {
              const newAccessToken = refreshResponse.data.data.accessToken;
              localStorage.setItem("accessToken", newAccessToken);
              
              // Retry the original request with the new token
              error.config.headers = error.config.headers || {};
              error.config.headers.Authorization = `Bearer ${newAccessToken}`;
              // eslint-disable-next-line no-console
              console.log("[TOKEN REFRESH] Retrying original request with new token");
              return API(error.config);
            }
          } catch (refreshError) {
            // Refresh failed, redirect to login
            // eslint-disable-next-line no-console
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
