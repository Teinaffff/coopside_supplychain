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
    
    // Debug: Check if token exists and log its presence
    if (!accessToken) {
      console.warn(`[AUTH WARNING] No access token found for request to ${config.url}`);
    } else {
      // Add Authorization header with Bearer token
      config.headers.Authorization = `Bearer ${accessToken}`;
      
      // Verify the header was set correctly
      if (!config.headers.Authorization) {
        console.error("[AUTH ERROR] Failed to set Authorization header");
      }
    }
    
    // eslint-disable-next-line no-console
    const maskedAuth = config.headers?.Authorization ? `${String(config.headers.Authorization).slice(0,8)}...` : null;
    console.log("[API REQUEST]", config.method?.toUpperCase(), config.url, { data: config.data, Authorization: maskedAuth });
  } catch (error) {
    console.error("[AUTH ERROR] Error in request interceptor:", error);
  }
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
      
      // Check if the request had an Authorization header
      const hadAuthHeader = error?.config?.headers?.Authorization;
      if (!hadAuthHeader) {
        console.error("[AUTH ERROR] Request failed with no Authorization header:", reqUrl);
      }
      
      // Handle 401 Unauthorized - token might be expired
      if (status === 401) {
        console.warn("[AUTH WARNING] Authentication required but not provided or token invalid");
        
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
            } else {
              console.error("[TOKEN REFRESH] Server returned success but no new access token");
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
          console.error("[AUTH ERROR] No refresh token available to recover from 401 error");
          // No refresh token, redirect to login
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
        }
      }
    } catch (error) {
      console.error("[ERROR HANDLER] Error in response interceptor:", error);
    }
    return Promise.reject(error);
  }
);

export default API;
