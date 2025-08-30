export const ROLES = {
  ADMIN: "ADMIN",
  USER: "USER",
  MANAGER: "MANAGER",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];
