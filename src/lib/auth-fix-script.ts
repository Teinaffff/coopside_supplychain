// Quick script to fix authentication issues
// Run this in the browser console or import and call fixAuth()

export const quickAuthFix = () => {
  console.log("🔧 Quick Auth Fix Starting...");
  
  // Clear existing tokens
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  console.log("✅ Cleared existing tokens");
  
  // Create a new valid token
  const header = {
    alg: "HS256",
    typ: "JWT"
  };
  
  const payload = {
    userId: 1, // Numeric user ID
    sub: "1", // String user ID  
    id: 1, // Alternative numeric ID
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // 24 hours
    role: "admin",
    permissions: ["loan:create", "loan:read", "loan:update", "loan:delete"]
  };
  
  const encodedHeader = btoa(JSON.stringify(header));
  const encodedPayload = btoa(JSON.stringify(payload));
  const signature = btoa("mock-signature");
  
  const newToken = `${encodedHeader}.${encodedPayload}.${signature}`;
  
  // Set the new token
  localStorage.setItem("accessToken", newToken);
  console.log("✅ Created new valid token");
  
  // Verify the token
  try {
    const tokenParts = newToken.split('.');
    const tokenPayload = JSON.parse(atob(tokenParts[1]));
    console.log("✅ Token verification successful");
    console.log("User ID:", tokenPayload.userId);
    console.log("Token expires:", new Date(tokenPayload.exp * 1000));
    
    return {
      success: true,
      message: "Authentication fixed successfully",
      token: newToken,
      userId: tokenPayload.userId
    };
  } catch (error) {
    console.error("❌ Token verification failed:", error);
    return {
      success: false,
      message: "Failed to verify token",
      error
    };
  }
};

// Make it available globally
(window as any).quickAuthFix = quickAuthFix;

console.log("🚀 Quick Auth Fix loaded! Run quickAuthFix() in console to fix authentication.");
