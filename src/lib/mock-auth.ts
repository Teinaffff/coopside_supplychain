// Mock authentication for testing purposes
// This is a temporary solution for testing the loan product API

export const createMockToken = (userId: string = "1") => {
  // Create a simple mock JWT token for testing
  const header = {
    alg: "HS256",
    typ: "JWT"
  };
  
  // Try different user ID formats that might be expected by the backend
  const payload = {
    // Try numeric user ID first
    userId: parseInt(userId),
    sub: userId,
    id: parseInt(userId),
    // Also try string versions
    user_id: userId,
    user_id_string: userId,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // 24 hours
    role: "admin",
    permissions: ["loan:create", "loan:read", "loan:update", "loan:delete"]
  };
  
  // Simple base64 encoding (not secure, just for testing)
  const encodedHeader = btoa(JSON.stringify(header));
  const encodedPayload = btoa(JSON.stringify(payload));
  const signature = btoa("mock-signature");
  
  return `${encodedHeader}.${encodedPayload}.${signature}`;
};

export const setMockAuth = (userId: string = "1") => {
  const mockToken = createMockToken(userId);
  localStorage.setItem("accessToken", mockToken);
  localStorage.setItem("refreshToken", "mock-refresh-token");
  console.log("Mock authentication set for user:", userId);
  return mockToken;
};

// Try different user ID formats
export const setMockAuthWithUUID = () => {
  const payload = {
    userId: "550e8400-e29b-41d4-a716-446655440000", // UUID format
    sub: "550e8400-e29b-41d4-a716-446655440000",
    id: "550e8400-e29b-41d4-a716-446655440000",
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60),
    role: "admin"
  };
  
  const header = { alg: "HS256", typ: "JWT" };
  const encodedHeader = btoa(JSON.stringify(header));
  const encodedPayload = btoa(JSON.stringify(payload));
  const signature = btoa("mock-signature");
  const token = `${encodedHeader}.${encodedPayload}.${signature}`;
  
  localStorage.setItem("accessToken", token);
  localStorage.setItem("refreshToken", "mock-refresh-token");
  console.log("Mock authentication set with UUID format");
  return token;
};

export const setMockAuthWithLongId = () => {
  const payload = {
    userId: "12345678901234567890", // Long numeric string
    sub: "12345678901234567890",
    id: "12345678901234567890",
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60),
    role: "admin"
  };
  
  const header = { alg: "HS256", typ: "JWT" };
  const encodedHeader = btoa(JSON.stringify(header));
  const encodedPayload = btoa(JSON.stringify(payload));
  const signature = btoa("mock-signature");
  const token = `${encodedHeader}.${encodedPayload}.${signature}`;
  
  localStorage.setItem("accessToken", token);
  localStorage.setItem("refreshToken", "mock-refresh-token");
  console.log("Mock authentication set with long ID format");
  return token;
};

// Try to fix existing token by modifying user ID format
export const fixExistingToken = () => {
  const existingToken = localStorage.getItem("accessToken");
  if (!existingToken) {
    console.log("No existing token to fix");
    return null;
  }

  try {
    const parts = existingToken.split('.');
    const payload = JSON.parse(atob(parts[1]));
    
    // Try different user ID formats
    const fixedPayload = {
      ...payload,
      userId: 1, // Try numeric
      sub: "1",
      id: 1,
      user_id: 1,
      user_id_string: "1"
    };
    
    const header = { alg: "HS256", typ: "JWT" };
    const encodedHeader = btoa(JSON.stringify(header));
    const encodedPayload = btoa(JSON.stringify(fixedPayload));
    const signature = btoa("mock-signature");
    const fixedToken = `${encodedHeader}.${encodedPayload}.${signature}`;
    
    localStorage.setItem("accessToken", fixedToken);
    console.log("Fixed existing token with numeric user ID");
    return fixedToken;
  } catch (error) {
    console.error("Error fixing existing token:", error);
    return null;
  }
};
