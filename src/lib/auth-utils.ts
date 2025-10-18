// Auth utility functions for debugging and token management

export const checkAuthStatus = () => {
  const accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");
  
  console.log("=== AUTH STATUS CHECK ===");
  console.log("Access Token exists:", !!accessToken);
  console.log("Refresh Token exists:", !!refreshToken);
  
  if (accessToken) {
    try {
      const tokenPayload = JSON.parse(atob(accessToken.split('.')[1]));
      console.log("Token payload:", tokenPayload);
      console.log("User ID:", tokenPayload.userId || tokenPayload.sub || tokenPayload.id);
      console.log("Token expires at:", new Date(tokenPayload.exp * 1000));
      console.log("Token is expired:", Date.now() >= tokenPayload.exp * 1000);
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  }
  
  console.log("Available localStorage keys:", Object.keys(localStorage));
  console.log("=========================");
  
  return {
    hasAccessToken: !!accessToken,
    hasRefreshToken: !!refreshToken,
    accessToken,
    refreshToken
  };
};

export const clearAuthTokens = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  console.log("Auth tokens cleared");
};

export const setAuthTokens = (accessToken: string, refreshToken?: string) => {
  localStorage.setItem("accessToken", accessToken);
  if (refreshToken) {
    localStorage.setItem("refreshToken", refreshToken);
  }
  console.log("Auth tokens set");
};
